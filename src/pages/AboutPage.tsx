
import React from 'react';
import { 
  Accordion,
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutPage = () => {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">About Content Planning Tool</h1>
      
      <Tabs defaultValue="usage">
        <TabsList className="mb-6">
          <TabsTrigger value="usage">Usage Instructions</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Plan and organize your content schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                  <p className="text-muted-foreground">
                    The content calendar helps you organize your posts across different platforms.
                    You can view your content by day, week, or month.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Adding Content</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the Content Calendar page</li>
                    <li>Click on a date or the "Add Content" button</li>
                    <li>Fill in the content details in the form</li>
                    <li>Save your content</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Managing Content</h3>
                  <p className="text-muted-foreground">
                    You can edit or delete content by clicking on an existing item in the calendar.
                    All changes are saved automatically to your account.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Generate Plan</CardTitle>
                <CardDescription>Use AI to create content plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Creating Content Plans</h3>
                  <p className="text-muted-foreground">
                    The Generate Plan feature helps you create comprehensive content plans based on keywords and topics.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Steps to Generate a Plan</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Go to the Generate Plan page</li>
                    <li>Enter your keywords and target audience information</li>
                    <li>Click "Generate Plan"</li>
                    <li>Review the suggested content</li>
                    <li>Add selected items to your calendar</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Designer</CardTitle>
                <CardDescription>Create and manage email templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Designing Emails</h3>
                  <p className="text-muted-foreground">
                    The Email Designer helps you create professional-looking email templates for your marketing campaigns.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email Design Process</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the Email Designer page</li>
                    <li>Choose a template or start from scratch</li>
                    <li>Add and customize content blocks</li>
                    <li>Preview your design</li>
                    <li>Save or export your template</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Website Management</CardTitle>
                <CardDescription>Manage multiple websites</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Switching Websites</h3>
                  <p className="text-muted-foreground">
                    Use the Website Switcher in the header to change between different websites in your account.
                    Each website has its own content calendar and settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Website-Specific Content</h3>
                  <p className="text-muted-foreground">
                    Content plans and email templates are specific to each website, allowing you to manage
                    multiple properties efficiently.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I save my content?</AccordionTrigger>
                  <AccordionContent>
                    Content is automatically saved to your account when you're logged in. If you're not logged in,
                    content is temporarily saved in your browser's local storage.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I export my content calendar?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export your content calendar to various formats including CSV and PDF.
                    Look for the export button in the Content Calendar view.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I share my content plan with my team?</AccordionTrigger>
                  <AccordionContent>
                    Currently, you can export your content plan and share it manually. We're working on 
                    collaborative features for team sharing in upcoming releases.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all your data is securely stored and encrypted. We use industry-standard security
                    practices to ensure your content plans and account information remain private.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I schedule posts directly from the platform?</AccordionTrigger>
                  <AccordionContent>
                    Currently, the platform is focused on planning content rather than scheduling. However,
                    we're working on integrations with popular social media management tools for direct scheduling.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>How do I manage my account settings?</AccordionTrigger>
                  <AccordionContent>
                    You can access your account settings by clicking on the profile icon in the top right corner
                    of the page and selecting "Profile" from the dropdown menu. From there, you can update your
                    password and manage your account information.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger>What browsers are supported?</AccordionTrigger>
                  <AccordionContent>
                    Our platform works best on modern browsers including Chrome, Firefox, Safari, and Edge.
                    For the best experience, make sure your browser is updated to the latest version.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
                  <AccordionContent>
                    Currently, we offer a responsive web application that works on mobile devices. A dedicated
                    mobile app is on our roadmap for future development.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AboutPage;
