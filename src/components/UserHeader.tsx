
import React from 'react';
import WebsiteSwitcher from './WebsiteSwitcher';
import UserProfileDropdown from './UserProfileDropdown';

const UserHeader: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <WebsiteSwitcher />
      <UserProfileDropdown />
    </div>
  );
};

export default UserHeader;
