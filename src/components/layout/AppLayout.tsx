
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6 pb-24 lg:pb-6">
        <Outlet />
      </div>
      <MobileNav />
    </div>
  );
};

export default AppLayout;
