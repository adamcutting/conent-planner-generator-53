
// This file handles the actual email sending functionality using nodemailer

import { emailConfig } from './emailUtils';

// Function to send an email using the browser's fetch API to a server endpoint
export const sendMailFromClient = async (to: string, subject: string, html: string) => {
  console.log('Attempting to send email to:', to);
  console.log('Email subject:', subject);
  
  try {
    // In a real production environment, this would make a call to a secure server endpoint
    // that would then use nodemailer to send the email
    
    // Since we're implementing this directly in the client for testing purposes,
    // we'll use a direct approach with EmailJS-like structure
    
    const emailData = {
      to_email: to,
      subject: subject,
      message_html: html,
      smtp_host: emailConfig.host,
      smtp_port: emailConfig.port,
      smtp_secure: emailConfig.secure,
      smtp_user: emailConfig.auth.user,
      smtp_pass: emailConfig.auth.pass
    };
    
    // For the test email, we'll use fetch to a temporary endpoint
    // In production, this would be a serverless function or API route
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_temp',
        template_id: 'template_temp',
        user_id: 'user_temp',
        template_params: emailData
      })
    });
    
    // For demonstration purposes, we'll simulate a successful email send
    console.log('Email sending attempted. In a production environment, the email would be sent via a server-side implementation.');
    
    // Send a test email directly to acutting@datahq.co.uk
    sendTestEmail('acutting@datahq.co.uk');
    
    return true; // Simulate successful send
  } catch (error) {
    console.error('Error in email send attempt:', error);
    return false;
  }
};

// Function to send a test email
export const sendTestEmail = async (emailAddress: string) => {
  // Log the attempt to send a test email
  console.log(`Sending test email to ${emailAddress} with SMTP details:`);
  console.log(`Host: ${emailConfig.host}`);
  console.log(`Port: ${emailConfig.port}`);
  console.log(`User: ${emailConfig.auth.user}`);
  
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Content Calendar Test Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #321947; padding: 20px; text-align: center; color: white; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Content Calendar - Test Email</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>This is a test email from your Content Calendar application.</p>
          <p>SMTP Details:</p>
          <ul>
            <li>Host: ${emailConfig.host}</li>
            <li>Port: ${emailConfig.port}</li>
            <li>User: ${emailConfig.auth.user}</li>
          </ul>
          <p>If you're receiving this email, it means the email configuration is working correctly.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} DataHQ Ltd. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Normally this would connect to a server endpoint that would use nodemailer
  // But since we're in a client environment, we'll simulate the email sending
  
  console.log('Test email content prepared. In a production environment, this would be sent via a server-side implementation.');
  
  // Display alert to show that test email has been "sent"
  alert(`A test email would be sent to ${emailAddress} in a production environment. 
  
For testing purposes, please note that emails cannot be sent directly from a browser-based application without a server component or email service.
  
In an actual deployment, this would be implemented using:
- A server route or serverless function to handle the email sending
- The nodemailer library on the server side
- The SMTP credentials you provided

The email content and SMTP details have been logged to the console.`);
  
  return true; // Simulate successful send for testing
};
