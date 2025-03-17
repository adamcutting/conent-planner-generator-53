
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WebsiteSwitcher } from '@/components/WebsiteSwitcher';
import { useWebsite } from '@/contexts/WebsiteContext';
import UserProfileDropdown from './UserProfileDropdown';

const AppHeader = () => {
  const location = useLocation();
  const { selectedWebsite } = useWebsite();
  
  return (
    <header className="header w-full sticky top-0 z-50">
      {/* Top navigation bar - similar to datahq.co.uk */}
      <div className="hidden lg:block bg-datahq-purple text-[#F6F3ED] py-2">
        <div className="container mx-auto">
          <ul className="flex flex-row gap-4 justify-end text-sm mr-2.5">
            <li>
              <Link to="/about" className="transition-colors duration-300 hover:text-datahq-yellow font-semibold">
                About
              </Link>
            </li>
            <li className="ml-2">
              <UserProfileDropdown />
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main header section */}
      <div className="py-4 lg:py-8 bg-[#F6F3ED] border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center flex-wrap justify-between lg:grid lg:grid-flow-col">
            {/* Logo section */}
            <div className="flex shrink items-center lg:block lg:order-1">
              <Link to="/" title="Return to homepage" className="block">
                <img
                  width="130"
                  height="24"
                  src="https://ia2-dhq.edcdn.com/dist/images/interface/logo.svg"
                  alt="Data HQ"
                  className="block w-[89px] h-[24px] sm:w-[130px] sm:h-[24px]"
                  crossOrigin="anonymous"
                />
              </Link>
            </div>

            {/* Right side elements - Website Switcher only */}
            <div className="lg:order-3 ml-auto lg:ml-0 flex items-center gap-4 xl:gap-6">
              <WebsiteSwitcher />
              {/* Show UserProfileDropdown in mobile layout */}
              <div className="lg:hidden">
                <UserProfileDropdown />
              </div>
            </div>

            {/* Main Navigation - switching the order of Content Calendar and Generate Plan */}
            <div className="hidden lg:block lg:order-2 w-full mt-4 lg:mt-0 lg:w-auto">
              <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-8 xl:gap-16">
                <li className="navigation-menu-item lg:opacity-100">
                  <Link
                    to="/generate"
                    className={`block py-2 font-semibold text-3xl lg:text-base w-full xl:text-base transition duration-200 ease-linear hover:text-datahq-brightmagenta ${
                      location.pathname === "/generate" ? "text-datahq-brightmagenta" : ""
                    }`}
                  >
                    Generate Plan
                  </Link>
                </li>
                <li className="navigation-menu-item lg:opacity-100">
                  <Link
                    to="/"
                    className={`block py-2 font-semibold text-3xl lg:text-base w-full xl:text-base transition duration-200 ease-linear hover:text-datahq-brightmagenta ${
                      location.pathname === "/" ? "text-datahq-brightmagenta" : ""
                    }`}
                  >
                    Content Calendar
                  </Link>
                </li>
                <li className="navigation-menu-item lg:opacity-100">
                  <Link
                    to="/email"
                    className={`block py-2 font-semibold text-3xl lg:text-base w-full xl:text-base transition duration-200 ease-linear hover:text-datahq-brightmagenta ${
                      location.pathname === "/email" ? "text-datahq-brightmagenta" : ""
                    }`}
                  >
                    Email Designer
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Mobile Navigation - also switching the order here */}
            <div className="lg:hidden w-full mt-4">
              <div className="flex justify-between border-t border-gray-100 pt-4">
                <Link to="/generate" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/generate" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Generate
                </Link>
                <Link to="/" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Calendar
                </Link>
                <Link to="/email" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/email" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Email
                </Link>
                <Link to="/about" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/about" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  About
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Website indicator banner */}
      <div 
        className="w-full h-1"
        style={{ backgroundColor: selectedWebsite.color }}
      ></div>
    </header>
  );
};

export default AppHeader;
