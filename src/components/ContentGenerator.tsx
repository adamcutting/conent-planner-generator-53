
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  SparklesIcon, 
  LightbulbIcon, 
  RotateCw, 
  PencilIcon,
  SaveIcon,
  HashIcon
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentPlanItem } from '@/utils/calendarUtils';
import { contentPrompts, GeneratedContent } from '@/utils/contentUtils';
import { generateContentWithOpenAI, isApiKeySet } from '@/utils/openaiUtils';
import OpenAISetup from './OpenAISetup';
import { useToast } from '@/components/ui/use-toast';

interface ContentGeneratorProps {
  contentItem?: ContentPlanItem;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ contentItem, onSave, onClose }) => {
  const { toast } = useToast();
  const [contentType, setContentType] = useState<string>(contentItem?.contentType || 'blog');
  const [prompt, setPrompt] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedKeyword, setSelectedKeyword] = useState<string>(
    contentItem?.keywords && contentItem.keywords.length > 0 ? contentItem.keywords[0] : ''
  );
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [title, setTitle] = useState<string>(contentItem?.title || '');
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [openAIConfigured, setOpenAIConfigured] = useState<boolean>(isApiKeySet());
  
  // Setup the initial prompt based on content type and keyword
  useEffect(() => {
    if (contentType && selectedKeyword) {
      const promptOptions = contentPrompts[contentType as keyof typeof contentPrompts] || [];
      if (promptOptions.length > 0) {
        setPrompt(promptOptions[0].replace('{KEYWORD}', selectedKeyword));
      }
    }
  }, [contentType, selectedKeyword]);
  
  const handlePromptSelect = (promptTemplate: string) => {
    setPrompt(promptTemplate.replace('{KEYWORD}', selectedKeyword));
  };
  
  const handleGenerateContent = async () => {
    if (!openAIConfigured) {
      toast({
        title: "OpenAI API Key Required",
        description: "Please configure your OpenAI API key to generate content",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const promptToUse = customPrompt || prompt;
      const generated = await generateContentWithOpenAI(promptToUse, selectedKeyword);
      
      setGeneratedContent(generated);
      setTitle(generated.title);
      setContent(generated.content);
      
      toast({
        title: "Content Generated",
        description: "AI-generated content is ready for editing"
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSave = () => {
    onSave(title, content);
  };

  return (
    <div className="glass-panel rounded-xl p-6 animate-scale-in max-w-4xl w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <SparklesIcon className="mr-2 h-5 w-5 text-primary" />
          Content Generator
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      {!openAIConfigured && (
        <div className="mb-6">
          <OpenAISetup onKeyConfigured={() => setOpenAIConfigured(true)} />
        </div>
      )}
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="generator" className="flex items-center">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center">
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <Label htmlFor="content-type">Content Type</Label>
              <select
                id="content-type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 border rounded-md mt-1.5"
              >
                <option value="blog">Blog Post</option>
                <option value="social">Social Media</option>
                <option value="video">Video Script</option>
                <option value="email">Email Newsletter</option>
                <option value="infographic">Infographic</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="keyword">Target Keyword</Label>
              <Input
                id="keyword"
                value={selectedKeyword}
                onChange={(e) => setSelectedKeyword(e.target.value)}
                placeholder="Enter primary keyword"
                className="mt-1.5"
              />
            </div>
          </div>
          
          <div>
            <Label>Prompt Templates</Label>
            <ScrollArea className="h-[100px] border rounded-md p-2 mt-1.5">
              {contentPrompts[contentType as keyof typeof contentPrompts]?.map((promptTemplate, idx) => (
                <div 
                  key={idx}
                  onClick={() => handlePromptSelect(promptTemplate)}
                  className="p-2 rounded-md mb-1 cursor-pointer hover:bg-secondary"
                >
                  {promptTemplate.replace('{KEYWORD}', selectedKeyword)}
                </div>
              ))}
            </ScrollArea>
          </div>
          
          <div>
            <Label htmlFor="prompt">Custom Prompt</Label>
            <Textarea
              id="prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Write your custom prompt here, or use a template from above"
              className="min-h-24 mt-1.5"
            />
          </div>
          
          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating || (!prompt && !customPrompt) || !selectedKeyword}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="editor" className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your content will appear here"
              className="min-h-[300px] font-mono text-sm mt-1.5"
            />
          </div>
          
          {generatedContent && (
            <div className="border rounded-md p-3 bg-muted/30">
              <h3 className="font-medium flex items-center mb-2">
                <LightbulbIcon className="mr-2 h-4 w-4 text-amber-500" />
                Suggestions for improvement
              </h3>
              <div className="space-y-1 text-sm">
                {generatedContent.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="h-5 w-5 text-muted-foreground mr-1 flex-shrink-0">•</div>
                    <p>{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Content
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentGenerator;
