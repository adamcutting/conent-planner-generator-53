
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EmailSettings from '@/components/EmailSettings';
import ContentGenerator from '@/components/ContentGenerator';
import { ContentPlanItem } from '@/utils/calendarUtils';

interface ContentDialogsProps {
  showEmailSettings: boolean;
  setShowEmailSettings: (show: boolean) => void;
  showContentGenerator: boolean;
  setShowContentGenerator: (show: boolean) => void;
  editingContentItem: ContentPlanItem | undefined;
  setEditingContentItem: (item: ContentPlanItem | undefined) => void;
  onSaveContent: (title: string, content: string) => void;
}

const ContentDialogs: React.FC<ContentDialogsProps> = ({
  showEmailSettings,
  setShowEmailSettings,
  showContentGenerator,
  setShowContentGenerator,
  editingContentItem,
  setEditingContentItem,
  onSaveContent,
}) => {
  return (
    <>
      <Dialog open={showEmailSettings} onOpenChange={setShowEmailSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Email Settings</DialogTitle>
          <EmailSettings onClose={() => setShowEmailSettings(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showContentGenerator} onOpenChange={setShowContentGenerator}>
        <DialogContent className="sm:max-w-[800px] p-0">
          <DialogTitle className="sr-only">Content Generator</DialogTitle>
          <ContentGenerator 
            contentItem={editingContentItem}
            onSave={onSaveContent}
            onClose={() => {
              setShowContentGenerator(false);
              setEditingContentItem(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentDialogs;
