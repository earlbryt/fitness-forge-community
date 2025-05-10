
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="lg:ml-64 p-5 md:p-7 pb-24 lg:pb-7 max-w-7xl">
        <Outlet />
      </div>
      <MobileNav />
    </div>
  );
};

export default AppLayout;
