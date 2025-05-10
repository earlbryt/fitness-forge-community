
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, List, Award, BarChart2, MessageSquare, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="desktop-only bg-white border-r border-gray-100 w-64 flex flex-col h-screen fixed shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-brand-dark flex items-center">
          <span className="text-brand-primary">Fit</span>Community
        </h1>
      </div>
      <nav className="flex-1 pt-6 px-3">
        <SidebarLink to="/app" icon={<Activity />} label="Dashboard" />
        <SidebarLink to="/app/workouts" icon={<List />} label="Workouts" />
        <SidebarLink to="/app/challenges" icon={<Award />} label="Challenges" />
        <SidebarLink to="/app/leaderboard" icon={<BarChart2 />} label="Leaderboard" />
        <SidebarLink to="/app/tips" icon={<HelpCircle />} label="Tips & Tricks" />
        <SidebarLink to="/app/social" icon={<MessageSquare />} label="Social" />
      </nav>
      
      <div className="p-4 m-4 mt-auto rounded-xl bg-brand-light border border-brand-primary/10">
        <div className="text-sm font-medium text-brand-primary mb-2">Premium Plan</div>
        <p className="text-xs text-gray-600 mb-3">Get access to all premium features and workouts</p>
        <button className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white text-sm py-2 rounded-lg transition-colors">
          Upgrade Now
        </button>
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
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
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
