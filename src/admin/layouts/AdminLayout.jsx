import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <Topbar 
        toggleSidebar={toggleSidebar} 
        isCollapsed={isSidebarCollapsed} 
      />

      <main 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
