
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const AppLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-5 md:p-7 pb-24 lg:pb-7 max-w-7xl">
        <Outlet />
      </div>
      <MobileNav />
    </div>
  );
};

export default AppLayout;
