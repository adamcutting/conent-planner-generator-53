
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const AppHeader = () => {
  const location = useLocation();
  
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">DataHQ</span>
          </Link>
        </div>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/" ? "bg-accent/50" : ""
              )}>
                Content Calendar
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/generate" className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/generate" ? "bg-accent/50" : ""
              )}>
                Generate Plan
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/email" className={cn(
                navigationMenuTriggerStyle(),
                location.pathname === "/email" ? "bg-accent/50" : ""
              )}>
                Email Designer
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default AppHeader;
