
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellIcon, MailIcon, SaveIcon, CheckIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { emailSettings } from '@/utils/contentUtils';

interface EmailSettingsProps {
  onClose: () => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [daysBeforeDue, setDaysBeforeDue] = useState(1);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Load saved settings
    const savedSettings = emailSettings.get();
    if (savedSettings.email) {
      setEmail(savedSettings.email);
      setDaysBeforeDue(savedSettings.daysBeforeDue);
      setEmailNotificationsEnabled(true);
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
      emailSettings.save(email, daysBeforeDue);
      
      toast({
        title: "Settings saved",
        description: "Email notification settings have been updated",
      });
      
      // Show saved indicator
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } else {
      // Clear settings
      emailSettings.save('', 1);
      toast({
        title: "Notifications disabled",
        description: "Email notifications have been turned off",
      });
    }
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
          
          <div className="bg-muted/50 rounded-md p-3 text-sm text-muted-foreground">
            <p>Emails will be sent for content items due on or approaching their due date.</p>
            <p className="mt-1">Note: This feature requires that you keep this app open in your browser.</p>
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

export default EmailSettings;
