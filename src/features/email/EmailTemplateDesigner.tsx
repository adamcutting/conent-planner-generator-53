
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { SparklesIcon, Code, Upload, Wand2, Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailTemplateDesignerProps {
  onClose?: () => void;
}

interface EmailTemplate {
  html: string;
  subject: string;
  previewText: string;
}

const EmailTemplateDesigner: React.FC<EmailTemplateDesignerProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [baseTemplate, setBaseTemplate] = useState<File | null>(null);
  const [colors, setColors] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [keyMessage, setKeyMessage] = useState<string>('');
  const [ctas, setCtas] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'html' | 'preview'>('preview');

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBaseTemplate(e.target.files[0]);
      toast({
        title: "Template uploaded",
        description: `${e.target.files[0].name} has been uploaded as the base template`,
      });
    }
  };

  const generateTemplate = () => {
    setIsGenerating(true);
    
    // Simulate AI email template generation
    setTimeout(() => {
      const newTemplate: EmailTemplate = {
        subject: subject || "DataHQ - Your Data Partner",
        previewText: "Discover how clean data can transform your business outcomes",
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || "DataHQ - Your Data Partner"}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5;
      color: #333333;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
    }
    .header { 
      padding: 20px; 
      background-color: ${colors.split(',')[0] || '#d21783'}; 
      text-align: center;
    }
    .logo { 
      max-width: 150px; 
    }
    .content { 
      padding: 30px 20px; 
      line-height: 1.6;
    }
    .cta-button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: ${colors.split(',')[1] || '#321947'}; 
      color: white !important; 
      text-decoration: none; 
      border-radius: 4px; 
      margin: 20px 0;
      font-weight: bold;
    }
    .footer { 
      padding: 20px; 
      background-color: #f0f0f0; 
      text-align: center; 
      font-size: 12px; 
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.datahq.co.uk/wp-content/uploads/2021/07/datahq-logo-light.png" alt="DataHQ Logo" class="logo">
    </div>
    <div class="content">
      <h1>${subject || "Clean data for better business outcomes"}</h1>
      <p>Hello from the DataHQ team,</p>
      <p>${keyMessage || "Are you struggling with inaccurate or incomplete customer data? DataHQ provides industry-leading data cleansing and enhancement services to help you reach the right customers with the right message."}</p>
      <p>Our services can help you:</p>
      <ul>
        <li>Improve the accuracy of your customer data</li>
        <li>Enhance your marketing effectiveness</li>
        <li>Reach more qualified prospects</li>
        <li>Reduce wasted marketing spend</li>
      </ul>
      <p>Let us show you how quality data can transform your marketing efforts.</p>
      <div style="text-align: center;">
        <a href="${ctas.split(',')[0] || 'https://www.datahq.co.uk/contact-us/'}" class="cta-button">${ctas.split(',')[1] || 'Get in touch today'}</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2023 DataHQ Ltd. All rights reserved.</p>
      <p>123 Data Street, London, UK</p>
      <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`
      };
      
      setGeneratedTemplate(newTemplate);
      setIsGenerating(false);
      
      toast({
        title: "Email template generated",
        description: "Your AI-designed email template is ready to preview and use",
      });
    }, 2000);
  };

  const copyHtml = () => {
    if (generatedTemplate) {
      navigator.clipboard.writeText(generatedTemplate.html);
      toast({
        title: "HTML copied",
        description: "The HTML code has been copied to your clipboard",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/logo.svg" 
            alt="DataHQ Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Email Template Designer</h2>
        <p className="text-muted-foreground">
          Create professional HTML email templates for your marketing campaigns using AI.
          Fill in as many fields as you want - the AI will handle the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SparklesIcon className="mr-2 h-5 w-5 text-primary" />
              Design Options
            </CardTitle>
            <CardDescription>
              Provide as much or as little guidance as you want
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="base-template" className="mb-2 block">Upload Base Template (Optional)</Label>
              <div className="flex items-center border rounded-md p-2 hover:bg-secondary/50 cursor-pointer" onClick={() => document.getElementById('template-upload')?.click()}>
                <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{baseTemplate ? baseTemplate.name : 'Click to upload HTML template'}</span>
                <input 
                  id="template-upload" 
                  type="file" 
                  accept=".html,.htm" 
                  className="hidden" 
                  onChange={handleTemplateUpload}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="colors" className="mb-2 block">Brand Colors (Optional)</Label>
              <Input 
                id="colors" 
                placeholder="e.g. #d21783, #321947, #ffffff" 
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Enter hex codes separated by commas</p>
            </div>
            
            <div>
              <Label htmlFor="subject" className="mb-2 block">Email Subject Line</Label>
              <Input 
                id="subject" 
                placeholder="e.g. Transform your business with clean data" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="key-message" className="mb-2 block">Key Message</Label>
              <Textarea 
                id="key-message" 
                placeholder="What's the main message you want to communicate?" 
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="ctas" className="mb-2 block">Call-To-Actions</Label>
              <Input 
                id="ctas" 
                placeholder="e.g. https://example.com, Book a Demo" 
                value={ctas}
                onChange={(e) => setCtas(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">URL and button text, separated by comma</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateTemplate} 
              disabled={isGenerating} 
              className="w-full"
            >
              {isGenerating ? (
                <>Generating Template...</>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Email Template
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5 text-primary" />
              Email Preview
            </CardTitle>
            <CardDescription>
              Preview your AI-generated email template
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedTemplate ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">Subject: {generatedTemplate.subject}</p>
                    <p className="text-xs text-muted-foreground">Preview text: {generatedTemplate.previewText}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewMode('preview')}
                      className={previewMode === 'preview' ? 'bg-primary/10' : ''}
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPreviewMode('html')}
                      className={previewMode === 'html' ? 'bg-primary/10' : ''}
                    >
                      HTML
                    </Button>
                  </div>
                </div>
                
                {previewMode === 'preview' ? (
                  <div className="border rounded-md overflow-hidden" style={{ height: '400px' }}>
                    <iframe 
                      srcDoc={generatedTemplate.html}
                      title="Email Preview" 
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="absolute right-2 top-2 z-10"
                      onClick={copyHtml}
                    >
                      <Code className="h-4 w-4 mr-1" /> Copy
                    </Button>
                    <ScrollArea className="h-[400px] border rounded-md bg-muted p-4">
                      <pre className="text-xs font-mono">
                        {generatedTemplate.html}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center flex-col text-center border rounded-md p-6">
                <Wand2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  Your AI-generated email template will appear here
                </p>
                <p className="text-sm text-muted-foreground">
                  Fill in the form on the left and click "Generate Email Template"
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            {generatedTemplate && (
              <Button variant="outline" onClick={() => window.open('mailto:?subject=' + encodeURIComponent(generatedTemplate.subject))}>
                Test in Email Client
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplateDesigner;
