
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useWorkoutAuth from '@/hooks/useWorkoutAuth';
import { getFriendRequestsCount } from '@/services/social';
import { 
  LayoutDashboard, Search, Bell, Settings, 
  ChevronRight, Users, Calendar, TrendingUp, 
  Trophy, MessageCircle, Heart, UserCircle
} from 'lucide-react';

interface ModernDashboardProps {
  children: React.ReactNode;
}

const ModernDashboard = ({ children }: ModernDashboardProps) => {
  const { user } = useWorkoutAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [friendRequestCount, setFriendRequestCount] = useState(0);

  // Helper to determine if a route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Fetch friend request count on initial load and periodically
  useEffect(() => {
    const fetchFriendRequestCount = async () => {
      if (user) {
        const count = await getFriendRequestsCount();
        setFriendRequestCount(count);
      }
    };
    
    fetchFriendRequestCount();
    
    // Set up interval to check for new friend requests
    const interval = setInterval(fetchFriendRequestCount, 60000); // every minute
    
    return () => clearInterval(interval);
  }, [user]);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/app',
      icon: <LayoutDashboard size={20} />
    },
    {
      title: 'Workouts',
      path: '/app/workouts',
      icon: <TrendingUp size={20} />
    },
    {
      title: 'Challenges',
      path: '/app/challenges',
      icon: <Trophy size={20} />
    },
    {
      title: 'Leaderboard',
      path: '/app/leaderboard',
      icon: <Users size={20} />
    },
    {
      title: 'Social',
      path: '/app/social',
      icon: <MessageCircle size={20} />,
      badge: friendRequestCount > 0 ? friendRequestCount : null
    },
    {
      title: 'My Profile',
      path: '/app/profile',
      icon: <UserCircle size={20} />
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 hidden md:block bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo and App Title */}
          <div className="px-4 py-6 flex items-center gap-3 border-b border-gray-200 dark:border-slate-700">
            <div className="bg-brand-primary h-8 w-8 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
            <div>
              <h1 className="font-bold text-lg">
                <span className="text-brand-primary">Fit</span>
                <span className="text-brand-secondary">Community</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
            <div className="px-4 pb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            <ul>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive(item.path)
                        ? "bg-gray-100 dark:bg-slate-700 text-brand-primary dark:text-brand-primary font-medium"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="relative">
                      {item.icon}
                      {item.badge && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-medium px-1">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span>{item.title}</span>
                    {isActive(item.path) && <ChevronRight size={16} className="ml-auto" />}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="p-0 h-auto" 
                onClick={() => navigate('/app/profile')}
              >
                <Avatar className="h-10 w-10">
                  {user?.user_metadata?.avatar_url && (
                    <AvatarImage src={user.user_metadata.avatar_url} />
                  )}
                  <AvatarFallback className="bg-brand-primary text-white">
                    {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <div 
                className="ml-3 flex-1 overflow-hidden cursor-pointer" 
                onClick={() => navigate('/app/profile')}
              >
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
              <Button size="icon" variant="ghost">
                <Settings size={18} className="text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <div className="px-4 py-3 flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost">
                <Bell size={20} className="text-gray-500 dark:text-gray-400" />
              </Button>
              <Avatar className="h-8 w-8 md:hidden">
                {user?.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                )}
                <AvatarFallback className="bg-brand-primary text-white">
                  {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;
