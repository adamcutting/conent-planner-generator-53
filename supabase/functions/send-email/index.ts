
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, type } = await req.json();

    console.log(`Attempting to send email to: ${to}`);
    console.log(`Email subject: ${subject}`);
    console.log(`Email type: ${type}`);

    // Create SMTP client with the provided configuration
    const client = new SMTPClient({
      connection: {
        hostname: "mta.extendcp.co.uk",
        port: 587,
        tls: false,
        auth: {
          username: "businessleads@dhqbmail.co.uk",
          password: "Z6zJzn9vwmDJJJ",
        },
      },
    });

    // Send the email
    await client.send({
      from: "Content Calendar <businessleads@dhqbmail.co.uk>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully");

    // Close the connection
    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
