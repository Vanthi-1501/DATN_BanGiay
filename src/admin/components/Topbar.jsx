import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User, LogOut, Check, Trash2, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ toggleSidebar, isCollapsed, notifications = [], setNotifications }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken'); // Clear all potential auth keys
    navigate('/login');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả thông báo đơn hàng?")) {
      setNotifications([]);
      setShowDropdown(false);
    }
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setShowDropdown(false);
    navigate('/admin/orders');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
        {/* Notifications Icon and Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-2 rounded-full hover:bg-gray-100 transition-all relative ${showDropdown ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
            title="Thông báo đơn hàng"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-1 border-2 border-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 origin-top-right transition-all duration-200">
              {/* Dropdown Header */}
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">Thông báo đơn hàng</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <Check size={13} />
                    Đã đọc hết
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <Bell size={20} />
                    </div>
                    <span>Không có thông báo đơn hàng nào</span>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 items-start relative ${!notif.read ? 'bg-emerald-50/15' : ''}`}
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${!notif.read ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        <ShoppingBag size={14} />
                      </div>
                      <div className="flex-1 min-w-0 pr-3">
                        <p className={`text-xs text-gray-900 leading-tight ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-gray-400 mt-1.5 flex items-center gap-1 font-medium">
                          <Clock size={10} />
                          {formatTime(notif.time)}
                        </span>
                      </div>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-4 right-4 border-2 border-white"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Dropdown Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
                  <button 
                    onClick={handleClearAll}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md flex items-center gap-1 font-semibold transition-colors"
                  >
                    <Trash2 size={12} />
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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

