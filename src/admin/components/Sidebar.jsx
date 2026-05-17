import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tags, 
  Settings, 
  Image as ImageIcon,
  MessageSquare,
  Gift
} from 'lucide-react';
import classNames from 'classnames';

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Sản phẩm', icon: Package, path: '/admin/products' },
    { name: 'Danh mục', icon: Tags, path: '/admin/categories' },
    { name: 'Đơn hàng', icon: ShoppingBag, path: '/admin/orders' },
    { name: 'Khách hàng', icon: Users, path: '/admin/customers' },
    { name: 'Đánh giá', icon: MessageSquare, path: '/admin/reviews' },
    { name: 'Khuyến mãi', icon: Gift, path: '/admin/coupons' },
    { name: 'Banner', icon: ImageIcon, path: '/admin/banners' },
    { name: 'Cài đặt', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className={classNames(
      "bg-white h-screen border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 z-40",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        {isCollapsed ? (
          <span className="font-bold text-xl text-black">V</span>
        ) : (
          <span className="font-bold text-2xl text-black tracking-tight">VANTHI<span className="text-red-600">.</span>ADMIN</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => classNames(
                  "flex items-center px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                )}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className={classNames("shrink-0", isCollapsed ? "mx-auto" : "mr-3")} size={20} />
                {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Footer / User short info */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-xs text-gray-500 text-center">
            &copy; 2026 Vanthi Store
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
