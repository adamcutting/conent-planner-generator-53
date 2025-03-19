
// Email utilities for sending reminders and content

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  }
}

// Email configuration with provided credentials
export const emailConfig: EmailConfig = {
  host: 'mta.extendcp.co.uk',
  port: 587,
  secure: false, // false for TLS - port 587
  auth: {
    user: 'businessleads@dhqbmail.co.uk',
    pass: 'Z6zJzn9vwmDJJJ'
  }
};

// Email templates for different notification types
export const emailTemplates = {
  contentReminder: {
    subject: 'Content Reminder: Items Due Soon',
    generateHtml: (items: any[], recipientName?: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Content Calendar Reminder</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
          }
          .header { 
            background-color: #d21783; 
            padding: 20px; 
            text-align: center;
            color: white;
          }
          .content { 
            padding: 20px; 
            background-color: #ffffff;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666666;
            background-color: #f5f5f5;
          }
          .item {
            border-left: 4px solid #d21783;
            padding: 10px 15px;
            margin-bottom: 15px;
            background-color: #f9f9f9;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #d21783;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Content Calendar Reminder</h1>
          </div>
          <div class="content">
            <p>Hello${recipientName ? ' ' + recipientName : ''},</p>
            <p>This is a friendly reminder about your upcoming content due dates. The following items are due soon:</p>
            
            <div class="items">
              ${items.map(item => `
                <div class="item">
                  <h3>${item.title}</h3>
                  <p><strong>Due Date:</strong> ${new Date(item.dueDate).toLocaleDateString()}</p>
                  <p><strong>Type:</strong> ${item.contentType}</p>
                  <p>${item.description}</p>
                </div>
              `).join('')}
            </div>
            
            <p>Please review these items and make sure they're completed on time.</p>
            <a href="#" class="button">View Calendar</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DataHQ Ltd. All rights reserved.</p>
            <p>This email was sent to you because you enabled reminders in your Content Calendar app.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  contentCompleted: {
    subject: 'Content Calendar - Weekly Summary',
    generateHtml: (completed: any[], upcoming: any[], recipientName?: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Content Calendar Weekly Summary</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px;
            background-color: #ffffff;
          }
          .header { 
            background-color: #321947; 
            padding: 20px; 
            text-align: center;
            color: white;
          }
          .content { 
            padding: 20px; 
            background-color: #ffffff;
          }
          .footer { 
            padding: 20px; 
            text-align: center; 
            font-size: 12px; 
            color: #666666;
            background-color: #f5f5f5;
          }
          .section {
            margin-bottom: 25px;
          }
          .section-title {
            border-bottom: 2px solid #321947;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #321947;
          }
          .item {
            padding: 10px 15px;
            margin-bottom: 10px;
            background-color: #f9f9f9;
          }
          .completed {
            border-left: 4px solid #10b981;
          }
          .upcoming {
            border-left: 4px solid #f59e0b;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #321947;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Content Calendar Weekly Summary</h1>
          </div>
          <div class="content">
            <p>Hello${recipientName ? ' ' + recipientName : ''},</p>
            <p>Here's a summary of your content calendar activity:</p>
            
            <div class="section">
              <h2 class="section-title">Completed Content (${completed.length})</h2>
              ${completed.length > 0 
                ? completed.map(item => `
                    <div class="item completed">
                      <h3>${item.title}</h3>
                      <p><strong>Completed On:</strong> ${new Date(item.dueDate).toLocaleDateString()}</p>
                      <p><strong>Type:</strong> ${item.contentType}</p>
                    </div>
                  `).join('')
                : '<p>No content was completed in this period.</p>'
              }
            </div>
            
            <div class="section">
              <h2 class="section-title">Upcoming Content (${upcoming.length})</h2>
              ${upcoming.length > 0
                ? upcoming.map(item => `
                    <div class="item upcoming">
                      <h3>${item.title}</h3>
                      <p><strong>Due Date:</strong> ${new Date(item.dueDate).toLocaleDateString()}</p>
                      <p><strong>Type:</strong> ${item.contentType}</p>
                    </div>
                  `).join('')
                : '<p>No upcoming content in the next period.</p>'
              }
            </div>
            
            <p>Keep up the good work with your content strategy!</p>
            <a href="#" class="button">View Full Calendar</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DataHQ Ltd. All rights reserved.</p>
            <p>This email was sent to you because you enabled reminders in your Content Calendar app.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  test: {
    subject: 'Content Calendar - Test Email',
    generateHtml: (smtpDetails: EmailConfig) => `
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
          .info-box { background-color: #e9f5ff; border-left: 4px solid #0284c7; padding: 15px; margin-bottom: 20px; }
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
            <div class="info-box">
              <p><strong>SMTP Details:</strong></p>
              <ul>
                <li>Host: ${smtpDetails.host}</li>
                <li>Port: ${smtpDetails.port}</li>
                <li>User: ${smtpDetails.auth.user}</li>
              </ul>
              <p>If you're receiving this email, it means the email configuration is working correctly.</p>
            </div>
            <p>You can now use the email notification system to receive reminders about upcoming content and weekly summaries of your content plan.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DataHQ Ltd. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

// Import supabase client
import { supabase } from "@/integrations/supabase/client";

// Function to send an email using the Supabase Edge Function
export const sendEmail = async ({ to, subject, html, type = "notification" }: { 
  to: string, 
  subject: string, 
  html: string,
  type?: string 
}): Promise<boolean> => {
  console.log('Sending email to:', to);
  console.log('Email subject:', subject);
  
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        to,
        subject,
        html,
        type
      }
    });

    if (error) {
      console.error('Error from Edge Function:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Function to send a test email
export const sendTestEmail = async (emailAddress: string): Promise<boolean> => {
  // Log the attempt to send a test email
  console.log(`Sending test email to ${emailAddress} with SMTP details:`);
  console.log(`Host: ${emailConfig.host}`);
  console.log(`Port: ${emailConfig.port}`);
  console.log(`User: ${emailConfig.auth.user}`);
  
  // Generate the test email HTML
  const testHtml = emailTemplates.test.generateHtml(emailConfig);
  
  // Send the test email using the Edge Function
  return await sendEmail({
    to: emailAddress,
    subject: emailTemplates.test.subject,
    html: testHtml,
    type: 'test'
  });
};

// Track which content items we've already sent reminders for to avoid duplicates
const sentReminders = new Map<string, Date>();

// Helper to check if it's an appropriate time to send an email (8am local time)
const isAppropriateTimeToSendEmail = (): boolean => {
  const now = new Date();
  const hour = now.getHours();
  return hour === 8; // Only send at 8am
};

// Function to check for due content items and send reminders
export const checkAndSendReminders = async (
  contentPlan: any[], 
  emailAddress: string,
  daysBeforeDue: number
): Promise<boolean> => {
  if (!emailAddress) {
    console.log('No email address set, skipping reminders');
    return false;
  }
  
  // Check if it's an appropriate time to send emails
  if (!isAppropriateTimeToSendEmail()) {
    console.log('Not sending reminder - outside scheduled email time (8am)');
    return false;
  }

  const today = new Date();
  const reminderDate = new Date();
  reminderDate.setDate(today.getDate() + daysBeforeDue);
  
  // For logging
  console.log(`Checking for items due today (${today.toDateString()}) or on reminder date (${reminderDate.toDateString()})`);

  // Find content items that are due today or on the reminder date
  const dueItems = contentPlan.filter(item => {
    if (item.completed) return false;
    
    const dueDate = new Date(item.dueDate);
    const dueDateStr = dueDate.toDateString();
    const itemId = item.id;
    
    // Skip if we've already sent a reminder for this item today
    if (sentReminders.has(itemId)) {
      const lastSent = sentReminders.get(itemId);
      if (lastSent && lastSent.toDateString() === today.toDateString()) {
        console.log(`Already sent reminder for item ${itemId} today, skipping`);
        return false;
      }
    }
    
    // Check if due date matches today or reminder date
    return dueDateStr === today.toDateString() || dueDateStr === reminderDate.toDateString();
  });
  
  if (dueItems.length === 0) {
    console.log('No items due soon, no reminders sent');
    return false;
  }
  
  console.log(`Found ${dueItems.length} items due soon`);
  
  // Generate the email HTML using the template
  const subject = emailTemplates.contentReminder.subject;
  const html = emailTemplates.contentReminder.generateHtml(dueItems);
  
  // Send the email
  const success = await sendEmail({
    to: emailAddress,
    subject,
    html
  });
  
  // Mark these items as having had reminders sent
  if (success) {
    dueItems.forEach(item => {
      sentReminders.set(item.id, new Date());
    });
    console.log(`Successfully sent reminder for ${dueItems.length} items`);
  }
  
  return success;
};

// Function to send weekly summary of completed and upcoming content
export const sendWeeklySummary = async (
  contentPlan: any[],
  emailAddress: string
): Promise<boolean> => {
  if (!emailAddress) {
    console.log('No email address set, skipping weekly summary');
    return false;
  }
  
  // Check if it's Monday at 8am - appropriate time for weekly summary
  const now = new Date();
  if (now.getDay() !== 1 || now.getHours() !== 8) {
    console.log('Not sending weekly summary - not Monday 8am');
    return false;
  }
  
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);
  
  // Find completed content in the past week
  const completedItems = contentPlan.filter(item => {
    const dueDate = new Date(item.dueDate);
    return item.completed && dueDate >= oneWeekAgo && dueDate <= today;
  });
  
  // Find upcoming content in the next two weeks
  const upcomingItems = contentPlan.filter(item => {
    const dueDate = new Date(item.dueDate);
    return !item.completed && dueDate > today && dueDate <= twoWeeksFromNow;
  });
  
  // Generate the email HTML using the template
  const subject = emailTemplates.contentCompleted.subject;
  const html = emailTemplates.contentCompleted.generateHtml(completedItems, upcomingItems);
  
  // Send the email
  return await sendEmail({
    to: emailAddress,
    subject,
    html
  });
};

// Clear the cached sentReminders map at midnight each day
const resetSentRemindersAtMidnight = () => {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // tomorrow
    0, 0, 0 // midnight
  );
  
  const timeToMidnight = night.getTime() - now.getTime();
  
  // Set timeout to clear the map at midnight
  setTimeout(() => {
    console.log('Resetting sent reminders tracking at midnight');
    sentReminders.clear();
    // Setup the next day's reset
    resetSentRemindersAtMidnight();
  }, timeToMidnight);
};

// Initialize the midnight reset when the module is loaded
resetSentRemindersAtMidnight();
