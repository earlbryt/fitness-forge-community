
import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernDashboard from './ModernDashboard';
import { Toaster } from 'sonner';

const ModernAppLayout = () => {
  return (
    <>
      <ModernDashboard>
        <Outlet />
      </ModernDashboard>
      <Toaster position="top-right" />
    </>
  );
};

export default ModernAppLayout;
