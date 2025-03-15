import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WebsiteSwitcher } from '@/components/WebsiteSwitcher';
import { useWebsite } from '@/contexts/WebsiteContext';

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
              <a href="#" className="transition-colors duration-300 hover:text-datahq-yellow font-semibold">
                Demo
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors duration-300 hover:text-datahq-yellow font-semibold">
                About
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors duration-300 hover:text-datahq-yellow font-semibold">
                Contact
              </a>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 188" width="130" height="48" className="block w-[89px] h-[24px] sm:w-[119px] sm:h-[32px]">
                  <path d="M85 354c-10-3-25-13-34-22-12-13-17-32-17-64V95c0-46 9-67 34-80 14-7 31-10 66-10 48 0 66 3 83 16 23 17 32 43 32 89 0 39-8 63-27 79-13 11-25 15-46 16-15 0-16 1-17 15 0 18 2 18 84 20l49 1 1 23c1 12 1 30 0 39l-1 17H85zm128-110c14-5 23-17 27-34 3-15 3-63 0-78-4-17-13-30-25-35-6-2-21-4-35-4-27 0-39 6-46 23-5 12-7 74-2 91 4 16 12 28 24 34 10 5 41 8 57 3z" transform="scale(0.5)" className="fill-datahq-brightmagenta"/>
                  <path d="M398 354c-9-3-24-11-33-19-27-23-29-31-29-139 0-90 0-94 11-113 12-22 37-41 67-51 14-5 46-6 107-6 79 1 87 2 98 12 12 10 14 10 14 1 0-10 3-10 46-9l45 1 1 27 1 27h-38c-21 0-38 1-38 3 0 1-2 69-4 150l-3 147H398zm145-109c15-6 27-20 32-37 3-10 6-39 6-64 0-57-5-74-25-90-16-12-18-13-45-13-47 0-68 16-75 57-4 18-7 92-5 113 2 29 9 42 28 52 18 10 62 6 84-8z" transform="scale(0.5)" className="fill-datahq-brightmagenta"/>
                  <path d="M784 354c-11-5-25-16-30-25l-10-16-2-147-2-146h74c41 0 76 1 77 3 2 1 3 19 2 40l-2 38-32-3c-18-2-34-1-36 1-2 3-2 254 0 262 1 5-6 6-39 3z" transform="scale(0.5)" className="fill-datahq-purple"/>
                  <path d="M859 277V199h106c103 0 106 0 119 12 21 18 22 54 3 76-14 15-33 18-52 8-12-7-18-7-24 1-7 9-7 10 2 17 19 14 44 10 63-11 20-23 27-64 15-86-6-9-11-21-11-26 0-5-4-13-10-17-7-5-7-11-3-18 13-18 12-64-2-84-18-26-31-30-117-35l-89-4V277z" transform="scale(0.5)" className="fill-datahq-purple"/>
                </svg>
              </Link>
            </div>

            {/* Right side elements - Website Switcher and actions */}
            <div className="lg:order-3 ml-auto lg:ml-0 flex items-center gap-4 xl:gap-6">
              <WebsiteSwitcher />
              
              {/* Contact button styled like datahq.co.uk */}
              <div className="flex items-center lg:block print:hidden">
                <a
                  href="#"
                  className="text-xl text-datahq-brightmagenta font-semibold hidden md:block md:text-base md:transition md:duration-200 md:ease-linear md:rounded-xl md:text-center md:bg-datahq-brightmagenta md:text-white md:hover:bg-datahq-magenta md:px-6 md:py-3"
                >
                  <span className="relative">
                    <span className="hidden md:inline">Submit Enquiry</span>
                  </span>
                </a>
                <a
                  href="#"
                  className="text-xl text-datahq-brightmagenta font-semibold inline-block md:hidden"
                >
                  <span className="relative">Contact us</span>
                </a>
              </div>
            </div>

            {/* Main Navigation - keeping our existing menu items */}
            <div className="hidden lg:block lg:order-2 w-full mt-4 lg:mt-0 lg:w-auto">
              <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-8 xl:gap-16">
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
            
            {/* Mobile Navigation */}
            <div className="lg:hidden w-full mt-4">
              <div className="flex justify-between border-t border-gray-100 pt-4">
                <Link to="/" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Calendar
                </Link>
                <Link to="/generate" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/generate" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Generate
                </Link>
                <Link to="/email" className={`px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === "/email" ? "bg-muted text-datahq-brightmagenta" : ""
                }`}>
                  Email
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
