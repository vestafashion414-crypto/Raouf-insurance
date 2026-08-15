import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "onboarding@resend.dev";
const TO_EMAIL = "raoofbanna0@gmail.com";

interface DocInfo {
  label: string;
  path: string;
  signedUrl: string;
  filename: string;
  contentType: string;
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { record } = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return errorResponse(500, "Server is missing Supabase credentials");
    }

    if (!RESEND_API_KEY) {
      return errorResponse(500, "Email service is not configured (RESEND_API_KEY missing). Please contact the site administrator.");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const docFields = [
      { key: "driving_license_path", label: "Driving License" },
      { key: "emirates_id_path", label: "Emirates ID" },
      { key: "car_ownership_path", label: "Vehicle Registration" },
    ];

    const attachments: DocInfo[] = [];
    for (const doc of docFields) {
      const path = record[doc.key];
      if (path) {
        const { data: urlData } = await supabase.storage
          .from("quote-documents")
          .createSignedUrl(path, 86400);

        if (!urlData?.signedUrl) {
          return errorResponse(500, `Failed to generate download link for ${doc.label}`);
        }

        const fileRes = await fetch(urlData.signedUrl);
        if (!fileRes.ok) {
          return errorResponse(500, `Failed to download ${doc.label} from storage`);
        }

        const fileBuffer = await fileRes.arrayBuffer();
        const base64Content = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

        const ext = path.split(".").pop() ?? "bin";
        const contentType = fileRes.headers.get("content-type") ?? "application/octet-stream";

        attachments.push({
          label: doc.label,
          path,
          signedUrl: urlData.signedUrl,
          filename: `${doc.label.replace(/\s+/g, "_")}.${ext}`,
          contentType,
          content: base64Content,
        });
      }
    }

    const priceText = record.needs_contact
      ? "Needs WhatsApp contact (car value too high)"
      : record.estimated_price
        ? `AED ${record.estimated_price}/year`
        : "N/A";

    const docListHtml = attachments.length > 0
      ? attachments.map((a) => `<li><a href="${a.signedUrl}">${a.label}</a></li>`).join("")
      : "<li>No documents uploaded</li>";

    const emailHtml = `
      <h2>New Insurance Quote Request</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Customer Name</td><td style="padding:8px;border:1px solid #ddd;">${record.customer_name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${record.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${record.email || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Insurance Type</td><td style="padding:8px;border:1px solid #ddd;">${record.insurance_type}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Vehicle</td><td style="padding:8px;border:1px solid #ddd;">${record.brand} ${record.model} (${record.model_year})</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Vehicle Type</td><td style="padding:8px;border:1px solid #ddd;">${record.vehicle_type}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Cylinders</td><td style="padding:8px;border:1px solid #ddd;">${record.engine_cylinders}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Car Value</td><td style="padding:8px;border:1px solid #ddd;">${record.car_value ? "AED " + record.car_value : "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Driver Age</td><td style="padding:8px;border:1px solid #ddd;">${record.driver_age}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">License Years</td><td style="padding:8px;border:1px solid #ddd;">${record.license_years}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Estimated Price</td><td style="padding:8px;border:1px solid #ddd;">${priceText}</td></tr>
      </table>
      <h3>Documents</h3>
      <ul>${docListHtml}</ul>
      <p>Submitted at: ${new Date(record.created_at).toLocaleString()}</p>
    `;

    const emailBody: Record<string, unknown> = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `New Quote Request - ${record.customer_name}`,
      html: emailHtml,
    };

    if (attachments.length > 0) {
      emailBody.attachments = attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        type: a.contentType,
      }));
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API error:", errText);
      return errorResponse(500, `Email service error: ${errText}`);
    }

    const emailResult = await res.json();
    console.log("Email sent successfully:", emailResult.id);

    return new Response(JSON.stringify({ success: true, emailId: emailResult.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return errorResponse(500, `Failed to send email: ${err.message}`);
  }

  function errorResponse(status: number, message: string) {
    return new Response(
      JSON.stringify({ error: message }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
