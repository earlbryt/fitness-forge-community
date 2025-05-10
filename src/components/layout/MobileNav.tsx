
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, List, Award, BarChart2, MessageSquare } from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="mobile-only mobile-nav">
      <MobileNavItem to="/" icon={<Activity size={24} />} label="Home" />
      <MobileNavItem to="/workouts" icon={<List size={24} />} label="Workouts" />
      <MobileNavItem to="/challenges" icon={<Award size={24} />} label="Challenges" />
      <MobileNavItem to="/social" icon={<MessageSquare size={24} />} label="Social" />
      <MobileNavItem to="/leaderboard" icon={<BarChart2 size={24} />} label="Leaderboard" />
    </div>
  );
};

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const MobileNavItem = ({ to, icon, label }: MobileNavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `mobile-nav-item ${isActive ? 'active' : 'text-gray-500'}`
      }
    >
      {icon}
      <span className="text-xs">{label}</span>
    </NavLink>
  );
};

export default MobileNav;
