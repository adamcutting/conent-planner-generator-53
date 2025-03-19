
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, LogOut, Settings, User, Bug } from 'lucide-react';
import { StorageDebugger } from './DiagnosticTools';

const UserProfileDropdown = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV; // Check if we're in development mode

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/signin')}
        className="transition-colors duration-300 hover:text-datahq-yellow font-semibold"
      >
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    }
    return user.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="flex items-center gap-2">
      {isDev && <StorageDebugger />}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
            {profile?.avatar_url ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url} alt="Profile" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            ) : (
              <UserIcon className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {isDev && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => console.log('Local storage:', localStorage)}>
              <Bug className="mr-2 h-4 w-4" />
              <span>Debug Storage</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown;
