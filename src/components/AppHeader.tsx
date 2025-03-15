
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import WebsiteSwitcher from '@/components/WebsiteSwitcher';

const AppHeader = () => {
  const location = useLocation();
  
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo and Website Switcher */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 188" width="130" height="48" className="fill-datahq-brightmagenta">
                <path d="M85 354c-10-3-25-13-34-22-12-13-17-32-17-64V95c0-46 9-67 34-80 14-7 31-10 66-10 48 0 66 3 83 16 23 17 32 43 32 89 0 39-8 63-27 79-13 11-25 15-46 16-15 0-16 1-17 15 0 18 2 18 84 20l49 1 1 23c1 12 1 30 0 39l-1 17H85zm128-110c14-5 23-17 27-34 3-15 3-63 0-78-4-17-13-30-25-35-6-2-21-4-35-4-27 0-39 6-46 23-5 12-7 74-2 91 4 16 12 28 24 34 10 5 41 8 57 3z" transform="scale(0.5)"/>
                <path d="M398 354c-9-3-24-11-33-19-27-23-29-31-29-139 0-90 0-94 11-113 12-22 37-41 67-51 14-5 46-6 107-6 79 1 87 2 98 12 12 10 14 10 14 1 0-10 3-10 46-9l45 1 1 27 1 27h-38c-21 0-38 1-38 3 0 1-2 69-4 150l-3 147H398zm145-109c15-6 27-20 32-37 3-10 6-39 6-64 0-57-5-74-25-90-16-12-18-13-45-13-47 0-68 16-75 57-4 18-7 92-5 113 2 29 9 42 28 52 18 10 62 6 84-8z" transform="scale(0.5)"/>
                <path d="M784 354c-11-5-25-16-30-25l-10-16-2-147-2-146h74c41 0 76 1 77 3 2 1 3 19 2 40l-2 38-32-3c-18-2-34-1-36 1-2 3-2 254 0 262 1 5-6 6-39 3z" transform="scale(0.5)" className="fill-datahq-purple"/>
                <path d="M859 277V199h106c103 0 106 0 119 12 21 18 22 54 3 76-14 15-33 18-52 8-12-7-18-7-24 1-7 9-7 10 2 17 19 14 44 10 63-11 20-23 27-64 15-86-6-9-11-21-11-26 0-5-4-13-10-17-7-5-7-11-3-18 13-18 12-64-2-84-18-26-31-30-117-35l-89-4V277z" transform="scale(0.5)" className="fill-datahq-purple"/>
              </svg>
            </Link>
            <WebsiteSwitcher />
          </div>
          
          {/* Main Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  navigationMenuTriggerStyle(),
                  "font-medium",
                  location.pathname === "/" ? "text-datahq-brightmagenta" : ""
                )}>
                  Content Calendar
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/generate" className={cn(
                  navigationMenuTriggerStyle(),
                  "font-medium",
                  location.pathname === "/generate" ? "text-datahq-brightmagenta" : ""
                )}>
                  Generate Plan
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/email" className={cn(
                  navigationMenuTriggerStyle(),
                  "font-medium",
                  location.pathname === "/email" ? "text-datahq-brightmagenta" : ""
                )}>
                  Email Designer
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Mobile Navigation - Simplified for this implementation */}
          <div className="md:hidden w-full">
            <div className="flex justify-between border-t border-gray-100 mt-2 pt-4">
              <Link to="/" className={cn(
                "px-3 py-2 text-sm font-medium rounded-md",
                location.pathname === "/" ? "bg-muted text-datahq-brightmagenta" : ""
              )}>
                Calendar
              </Link>
              <Link to="/generate" className={cn(
                "px-3 py-2 text-sm font-medium rounded-md",
                location.pathname === "/generate" ? "bg-muted text-datahq-brightmagenta" : ""
              )}>
                Generate
              </Link>
              <Link to="/email" className={cn(
                "px-3 py-2 text-sm font-medium rounded-md",
                location.pathname === "/email" ? "bg-muted text-datahq-brightmagenta" : ""
              )}>
                Email
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Website indicator banner */}
      <div 
        className="w-full h-1"
        style={{ backgroundColor: "var(--website-color)" }}
      ></div>
    </header>
  );
};

export default AppHeader;
