
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, List, Award, BarChart2, MessageSquare } from 'lucide-react';

const MobileNav = () => {
  return (
    <div className="mobile-only mobile-nav">
      <MobileNavItem to="/app" icon={<Activity size={22} />} label="Home" />
      <MobileNavItem to="/app/workouts" icon={<List size={22} />} label="Workouts" />
      <MobileNavItem to="/app/challenges" icon={<Award size={22} />} label="Challenges" />
      <MobileNavItem to="/app/social" icon={<MessageSquare size={22} />} label="Social" />
      <MobileNavItem to="/app/leaderboard" icon={<BarChart2 size={22} />} label="Leaderboard" />
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
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

export default MobileNav;
