import React from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleSidebar, isCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logic to clear local storage / token
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className={`bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 right-0 z-30 transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}>
      
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
          <Search size={18} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="bg-transparent border-none outline-none text-sm w-64 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 ml-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-gray-500" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-800 leading-tight">Admin</p>
            <p className="text-gray-500 text-xs">Quản trị viên</p>
          </div>
          <button onClick={handleLogout} className="ml-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
