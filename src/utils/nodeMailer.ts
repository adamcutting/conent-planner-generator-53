
// This file is kept for backward compatibility but email functionality
// has been moved to a Supabase Edge Function

import { emailConfig } from './emailUtils';

// This function is now a wrapper that logs the attempt but doesn't actually send emails
export const sendMailFromClient = async (to: string, subject: string, html: string) => {
  console.log('Email sending has been moved to Supabase Edge Functions');
  console.log('Attempted to send email to:', to);
  console.log('Email subject:', subject);
  
  // This function no longer attempts to send emails directly
  return false;
};

// Export the sendTestEmail function from emailUtils for backward compatibility
import { sendTestEmail } from './emailUtils';
export { sendTestEmail };
