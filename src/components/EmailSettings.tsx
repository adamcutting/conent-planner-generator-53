
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellIcon, MailIcon, SaveIcon, CheckIcon, SendIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { emailSettings } from '@/utils/contentUtils';
import { checkAndSendReminders, sendWeeklySummary, sendTestEmail } from '@/utils/emailUtils';
import { loadContentPlan } from '@/utils/contentUtils';
import { useAuth } from '@/contexts/AuthContext';

interface EmailSettingsProps {
  onClose: () => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [daysBeforeDue, setDaysBeforeDue] = useState(1);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  useEffect(() => {
    const savedSettings = emailSettings.get();
    if (savedSettings.email) {
      setEmail(savedSettings.email);
      setDaysBeforeDue(savedSettings.daysBeforeDue);
      setEmailNotificationsEnabled(true);
      setWeeklySummaryEnabled(savedSettings.weeklySummary || false);
    } else if (user?.email) {
      // If no saved email but user is logged in, prefill with user's email
      setEmail(user.email);
    }
  }, [user]);
  
  const handleSave = () => {
    if (emailNotificationsEnabled && !isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (emailNotificationsEnabled) {
      emailSettings.save(email, daysBeforeDue, weeklySummaryEnabled);
      
      toast({
        title: "Settings saved",
        description: "Email notification settings have been updated",
      });
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      
      // Clear existing reminder interval if any
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval);
        window.reminderCheckInterval = null;
      }
      
      // Setup a more controlled interval - check once per hour
      setupReminderChecks();
    } else {
      emailSettings.save('', 1, false);
      toast({
        title: "Notifications disabled",
        description: "Email notifications have been turned off",
      });
      
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval);
        window.reminderCheckInterval = null;
      }
      
      if (window.weeklySummaryInterval) {
        clearInterval(window.weeklySummaryInterval);
        window.weeklySummaryInterval = null;
      }
    }
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const setupReminderChecks = () => {
    // Check for reminders once per hour
    window.reminderCheckInterval = setInterval(() => {
      console.log('Checking for reminders (hourly check)');
      const settings = emailSettings.get();
      if (settings.email) {
        const contentPlan = loadContentPlan() || [];
        checkAndSendReminders(contentPlan, settings.email, settings.daysBeforeDue);
      }
    }, 60 * 60 * 1000); // Once per hour
    
    // Run an immediate check
    const settings = emailSettings.get();
    if (settings.email) {
      console.log('Running immediate reminder check after settings save');
      const contentPlan = loadContentPlan() || [];
      checkAndSendReminders(contentPlan, settings.email, settings.daysBeforeDue);
    }
    
    // For weekly summary, check once per day is sufficient
    if (window.weeklySummaryInterval) {
      clearInterval(window.weeklySummaryInterval);
    }
    
    window.weeklySummaryInterval = setInterval(() => {
      const settings = emailSettings.get();
      if (settings.email && settings.weeklySummary) {
        const contentPlan = loadContentPlan() || [];
        sendWeeklySummary(contentPlan, settings.email);
      }
    }, 24 * 60 * 60 * 1000); // Once per day
  };
  
  const handleTestEmail = async () => {
    // Use the email address from the form or fall back to the logged-in user's email
    const testEmail = email || (user?.email || '');
    
    if (!isValidEmail(testEmail)) {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      toast({
        title: "Sending test email",
        description: "Attempting to send test email via Supabase...",
      });
      
      const success = await sendTestEmail(testEmail);
      
      if (success) {
        toast({
          title: "Email sent successfully",
          description: `A test email has been sent to ${testEmail}`,
        });
      } else {
        toast({
          title: "Failed to send email",
          description: "Could not send the test email. Please check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending the test email",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="content-card animate-scale-in space-y-5">
      <div className="flex items-center space-x-2 mb-4">
        <BellIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Email Notifications</h2>
      </div>
      
      <div className="flex items-center space-x-3">
        <Switch
          checked={emailNotificationsEnabled}
          onCheckedChange={setEmailNotificationsEnabled}
          id="notification-enabled"
        />
        <Label htmlFor="notification-enabled">Enable email notifications</Label>
      </div>
      
      {emailNotificationsEnabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="flex">
              <div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="rounded-l-none"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="days-before">Notify me</Label>
            <select
              id="days-before"
              value={daysBeforeDue}
              onChange={(e) => setDaysBeforeDue(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            >
              <option value={0}>On the due date</option>
              <option value={1}>1 day before</option>
              <option value={2}>2 days before</option>
              <option value={3}>3 days before</option>
              <option value={7}>1 week before</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            <Switch
              checked={weeklySummaryEnabled}
              onCheckedChange={setWeeklySummaryEnabled}
              id="weekly-summary"
            />
            <Label htmlFor="weekly-summary">
              Send weekly summary of completed and upcoming content
            </Label>
          </div>
          
          <div className="bg-muted/50 rounded-md p-3 text-sm text-muted-foreground">
            <p>Emails will be sent for content items due on or approaching their due date.</p>
            <p className="mt-1">Note: This feature requires that you keep this app open in your browser.</p>
          </div>
          
          <div className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleTestEmail}
              disabled={isSending}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {isSending ? 'Sending test email...' : `Send test email to ${email || (user?.email || 'your email')}`}
            </Button>
          </div>
        </>
      )}
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isSaved ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    reminderCheckInterval: any;
    weeklySummaryInterval: any;
  }
}

export default EmailSettings;
