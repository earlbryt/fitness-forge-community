import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, List, Award, BarChart2, MessageSquare, CheckCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="desktop-only bg-white border-r border-gray-100 w-64 flex flex-col h-screen fixed shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-brand-dark flex items-center">
          <span className="text-brand-primary">Fit</span>Community
        </h1>
      </div>
      <nav className="flex-1 pt-6 px-3">
        <SidebarLink to="/app" icon={<Activity />} label="Dashboard" />
        <SidebarLink to="/app/workouts" icon={<CheckCircle />} label="Log Workout" />
        <SidebarLink to="/app/challenges" icon={<Award />} label="Challenges" />
        <SidebarLink to="/app/leaderboard" icon={<BarChart2 />} label="Leaderboard" />
        <SidebarLink to="/app/social" icon={<MessageSquare />} label="Community" />
      </nav>
      
      {/* User info */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center mr-3">
            <User size={20} className="text-brand-primary" />
          </div>
          <div>
            <div className="font-medium text-sm">{user?.email}</div>
            <div className="text-xs text-gray-500">Logged in</div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-gray-600 border-gray-200"
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = 
    (to === '/app' && location.pathname === '/app') || 
    (to !== '/app' && location.pathname.startsWith(to));
    
  return (
    <NavLink 
      to={to} 
      className={
        `flex items-center px-4 py-3 mb-2 rounded-xl transition-colors ${
          isActive 
            ? 'bg-brand-primary text-white font-medium' 
            : 'text-gray-600 hover:bg-brand-light hover:text-brand-primary'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
