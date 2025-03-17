
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellIcon, MailIcon, SaveIcon, CheckIcon, SendIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { emailSettings } from '@/utils/contentUtils';
import { checkAndSendReminders, sendWeeklySummary } from '@/utils/emailUtils';
import { loadContentPlan } from '@/utils/contentUtils';

interface EmailSettingsProps {
  onClose: () => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [daysBeforeDue, setDaysBeforeDue] = useState(1);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  useEffect(() => {
    // Load saved settings
    const savedSettings = emailSettings.get();
    if (savedSettings.email) {
      setEmail(savedSettings.email);
      setDaysBeforeDue(savedSettings.daysBeforeDue);
      setEmailNotificationsEnabled(true);
      setWeeklySummaryEnabled(savedSettings.weeklySummary || false);
    }
  }, []);
  
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
      // Save expanded settings with weekly summary option
      emailSettings.save(email, daysBeforeDue, weeklySummaryEnabled);
      
      toast({
        title: "Settings saved",
        description: "Email notification settings have been updated",
      });
      
      // Show saved indicator
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      
      // Set up a reminder check interval if not already running
      if (!window.reminderCheckInterval) {
        setupReminderChecks();
      }
    } else {
      // Clear settings
      emailSettings.save('', 1, false);
      toast({
        title: "Notifications disabled",
        description: "Email notifications have been turned off",
      });
      
      // Clear any running intervals
      if (window.reminderCheckInterval) {
        clearInterval(window.reminderCheckInterval);
        window.reminderCheckInterval = null;
      }
    }
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const setupReminderChecks = () => {
    // Check for reminders every hour (in a real app, this would be server-side)
    window.reminderCheckInterval = setInterval(() => {
      const settings = emailSettings.get();
      if (settings.email) {
        const contentPlan = loadContentPlan() || [];
        checkAndSendReminders(contentPlan, settings.email, settings.daysBeforeDue);
      }
    }, 60 * 60 * 1000); // Every hour
    
    // Also check for weekly summary every day
    if (!window.weeklySummaryInterval) {
      window.weeklySummaryInterval = setInterval(() => {
        const settings = emailSettings.get();
        if (settings.email && settings.weeklySummary) {
          const today = new Date();
          // Send weekly summary on Mondays
          if (today.getDay() === 1) {
            const contentPlan = loadContentPlan() || [];
            sendWeeklySummary(contentPlan, settings.email);
          }
        }
      }, 24 * 60 * 60 * 1000); // Once per day
    }
  };
  
  const handleTestEmail = async () => {
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address to send a test",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const contentPlan = loadContentPlan() || [];
      if (contentPlan.length === 0) {
        toast({
          title: "No content available",
          description: "Your content plan is empty. Please add some content items first.",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }
      
      // Send a test reminder with a sample from the content plan
      const success = await checkAndSendReminders(
        [contentPlan[0]], // Just use the first item as a sample
        email,
        daysBeforeDue
      );
      
      if (success) {
        toast({
          title: "Test email sent",
          description: "A test reminder email has been sent to your email address",
        });
      } else {
        toast({
          title: "Failed to send email",
          description: "Could not send the test email. Please check your connection and try again.",
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
              disabled={!isValidEmail(email) || isSending}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {isSending ? 'Sending test...' : 'Send test email'}
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

// For TypeScript
declare global {
  interface Window {
    reminderCheckInterval: any;
    weeklySummaryInterval: any;
  }
}

export default EmailSettings;
