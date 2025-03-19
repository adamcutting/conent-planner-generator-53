
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { loadContentPlanFromStorage, saveContentPlanToStorage } from '@/utils/contentPlanStorage';
import { ContentPlanItem } from '@/utils/calendarUtils';

/**
 * A diagnostic component to help debug storage issues
 */
export const StorageDebugger = () => {
  const [open, setOpen] = useState(false);
  const [diagnosticLog, setDiagnosticLog] = useState<string[]>([]);

  const addLogEntry = (entry: string) => {
    setDiagnosticLog(prev => [...prev, `[${new Date().toISOString()}] ${entry}`]);
    console.log(entry);
  };

  const runDiagnostics = () => {
    setDiagnosticLog([]);
    addLogEntry('Starting storage diagnostics...');

    // Test with a sample content plan
    const testItems: ContentPlanItem[] = [
      {
        id: 'test-1',
        title: 'Test Item 1',
        contentType: 'blog',
        contentStyle: 'knowledge', // Changed from 'informative' to 'knowledge'
        dueDate: new Date().toISOString(),
        website_id: 'test',
        user_id: 'test-user'
      },
      {
        id: 'test-2',
        title: 'Test Item 2',
        contentType: 'social',
        contentStyle: 'story', // Changed from 'casual' to 'story'
        dueDate: new Date().toISOString(),
        website_id: 'test',
        user_id: 'test-user'
      }
    ];

    // Test saving
    addLogEntry(`Attempting to save ${testItems.length} test items...`);
    const saveResult = saveContentPlanToStorage(testItems);
    addLogEntry(`Save result: ${saveResult ? 'Success' : 'Failed'}`);

    // Test loading
    addLogEntry('Attempting to load saved items...');
    const loadedItems = loadContentPlanFromStorage();
    
    if (!loadedItems) {
      addLogEntry('Load failed: No items returned');
    } else {
      addLogEntry(`Loaded ${loadedItems.length} items`);
      if (loadedItems.length !== testItems.length) {
        addLogEntry(`⚠️ WARNING: Expected ${testItems.length} items but got ${loadedItems.length}`);
      }
      addLogEntry('Loaded items:');
      loadedItems.forEach((item, index) => {
        addLogEntry(`Item ${index + 1}: id=${item.id}, title=${item.title}`);
      });
    }

    // Check localStorage directly
    try {
      const rawData = localStorage.getItem('contentCalendarPlan');
      addLogEntry(`Raw localStorage data: ${rawData ? 'exists' : 'not found'}`);
      if (rawData) {
        addLogEntry(`Raw data length: ${rawData.length} bytes`);
        try {
          const parsedData = JSON.parse(rawData);
          addLogEntry(`Parsed data is array: ${Array.isArray(parsedData)}`);
          addLogEntry(`Parsed data length: ${Array.isArray(parsedData) ? parsedData.length : 'not an array'}`);
        } catch (err) {
          addLogEntry(`Error parsing raw data: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } catch (err) {
      addLogEntry(`Error accessing localStorage: ${err instanceof Error ? err.message : String(err)}`);
    }

    addLogEntry('Diagnostics complete');
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Storage Debugger
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Storage Diagnostics</DialogTitle>
            <DialogDescription>
              Diagnose issues with content plan storage
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-2 mb-4">
            <Button onClick={runDiagnostics}>Run Diagnostics</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                localStorage.removeItem('contentCalendarPlan');
                addLogEntry('Cleared contentCalendarPlan from localStorage');
              }}
            >
              Clear Storage
            </Button>
          </div>

          <div className="border rounded-md p-4 bg-black text-white font-mono text-sm overflow-auto max-h-[400px]">
            {diagnosticLog.length > 0 ? (
              diagnosticLog.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap py-0.5">{log}</div>
              ))
            ) : (
              <div className="text-muted-foreground">Run diagnostics to see results...</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
