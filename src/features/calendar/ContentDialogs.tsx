
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
          <EmailSettings onClose={() => setShowEmailSettings(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showContentGenerator} onOpenChange={setShowContentGenerator}>
        <DialogContent className="sm:max-w-[800px] p-0">
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
