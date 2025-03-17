
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { to, subject, html, type } = await req.json();

    console.log(`Attempting to send email to: ${to}`);
    console.log(`Email subject: ${subject}`);
    console.log(`Email type: ${type}`);

    // Use native Deno.SmtpClient for email sending
    const encoder = new TextEncoder();
    
    // Create connection
    const conn = await Deno.connect({
      hostname: "mta.extendcp.co.uk",
      port: 587,
    });

    // Read greeting
    const buf = new Uint8Array(1024);
    await conn.read(buf);

    // Send EHLO
    await conn.write(encoder.encode("EHLO localhost\r\n"));
    await conn.read(buf);

    // Start TLS
    await conn.write(encoder.encode("STARTTLS\r\n"));
    await conn.read(buf);

    // Upgrade connection to TLS
    const tlsConn = await Deno.startTls(conn, {
      hostname: "mta.extendcp.co.uk",
    });

    // Send EHLO again
    await tlsConn.write(encoder.encode("EHLO localhost\r\n"));
    await tlsConn.read(buf);

    // Auth login
    await tlsConn.write(encoder.encode("AUTH LOGIN\r\n"));
    await tlsConn.read(buf);

    // Send username (base64 encoded)
    await tlsConn.write(encoder.encode(btoa("businessleads@dhqbmail.co.uk") + "\r\n"));
    await tlsConn.read(buf);

    // Send password (base64 encoded)
    await tlsConn.write(encoder.encode(btoa("Z6zJzn9vwmDJJJ") + "\r\n"));
    await tlsConn.read(buf);

    // Mail from
    await tlsConn.write(encoder.encode("MAIL FROM:<businessleads@dhqbmail.co.uk>\r\n"));
    await tlsConn.read(buf);

    // Recipient
    await tlsConn.write(encoder.encode(`RCPT TO:<${to}>\r\n`));
    await tlsConn.read(buf);

    // Data
    await tlsConn.write(encoder.encode("DATA\r\n"));
    await tlsConn.read(buf);

    // Construct email
    const email = [
      `From: Content Calendar <businessleads@dhqbmail.co.uk>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      html,
      `\r\n.\r\n`
    ].join("\r\n");

    // Send email content
    await tlsConn.write(encoder.encode(email));
    await tlsConn.read(buf);

    // Quit
    await tlsConn.write(encoder.encode("QUIT\r\n"));
    await tlsConn.read(buf);

    // Close connection
    tlsConn.close();

    console.log("Email sent successfully");

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
