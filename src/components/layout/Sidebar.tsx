
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, List, Award, BarChart2, MessageSquare, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="desktop-only bg-white border-r border-gray-200 w-64 flex flex-col h-screen fixed">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-brand-dark flex items-center">
          <span className="text-brand-primary">Fit</span>Community
        </h1>
      </div>
      <nav className="flex-1 pt-4 px-2">
        <SidebarLink to="/" icon={<Activity />} label="Dashboard" />
        <SidebarLink to="/workouts" icon={<List />} label="Workouts" />
        <SidebarLink to="/challenges" icon={<Award />} label="Challenges" />
        <SidebarLink to="/leaderboard" icon={<BarChart2 />} label="Leaderboard" />
        <SidebarLink to="/tips" icon={<HelpCircle />} label="Tips & Tricks" />
        <SidebarLink to="/social" icon={<MessageSquare />} label="Social" />
      </nav>
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
        `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
          isActive 
            ? 'bg-brand-primary text-white font-medium' 
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
