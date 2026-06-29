import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import axiosInstance from '../../services/axiosConfig';
import { ShoppingBag, X } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error reading notifications from localStorage:", e);
      return [];
    }
  });
  const [toasts, setToasts] = useState([]);
  const [maxOrderId, setMaxOrderId] = useState(0);
  const [newOrderTrigger, setNewOrderTrigger] = useState(0);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Lưu notifications vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error("Error writing notifications to localStorage:", e);
    }
  }, [notifications]);

  // Khởi tạo tần số âm thanh thông báo qua Web Audio API (tránh file tĩnh bị lỗi load)
  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      
      // Nốt bíp thứ 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // Âm cao A5
      gain1.gain.setValueAtTime(0.06, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.12);
      
      // Nốt bíp thứ 2 sau 150ms tạo âm đôi
      setTimeout(() => {
        if (audioCtx.state === 'closed') return;
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1100, audioCtx.currentTime); // Âm cao hơn
        gain2.gain.setValueAtTime(0.06, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.15);
      }, 150);
    } catch (err) {
      console.warn("Không thể phát âm thanh thông báo do trình duyệt chặn tương tác âm thanh ban đầu:", err);
    }
  };

  // Lấy mốc đơn hàng (maxOrderId) ban đầu để không spam thông báo cũ khi mới mở Admin
  useEffect(() => {
    const initMaxOrderId = async () => {
      try {
        const res = await axiosInstance.get('/admin/orders?pageSize=5&sortBy=orderId&sortOrder=desc');
        const orders = res.data.content || res.data || [];
        if (orders.length > 0) {
          const maxId = Math.max(...orders.map(o => o.orderId), 0);
          setMaxOrderId(maxId);
          console.log("[Notification System] Đã thiết lập mốc đơn hàng hiện tại:", maxId);
        } else {
          // Trường hợp hệ thống chưa có đơn hàng nào
          setMaxOrderId(0);
        }
      } catch (err) {
        console.error("Lỗi khi lấy mốc đơn hàng khởi tạo:", err);
      }
    };

    initMaxOrderId();
  }, []);

  // Thiết lập cơ chế Polling (Pull) định kỳ
  useEffect(() => {
    // Chỉ chạy polling sau khi mốc maxOrderId đã được thiết lập hoặc bằng 0 nếu chưa có đơn nào
    const intervalId = setInterval(async () => {
      try {
        const res = await axiosInstance.get('/admin/orders?pageSize=10&sortBy=orderId&sortOrder=desc');
        const orders = res.data.content || res.data || [];
        
        // Lọc ra các đơn hàng mới lớn hơn mốc đã biết
        const newOrders = orders
          .filter(o => o.orderId > maxOrderId)
          .sort((a, b) => a.orderId - b.orderId); // Sắp xếp tăng dần để hiển thị theo thời gian đặt

        if (newOrders.length > 0) {
          // Phát âm thanh báo hiệu
          playNotificationSound();

          // Kích hoạt cập nhật tức thì cho các trang quản lý con (Orders page)
          setNewOrderTrigger(prev => prev + 1);

          // Tìm maxOrderId mới nhất
          const nextMaxId = Math.max(...newOrders.map(o => o.orderId), maxOrderId);
          setMaxOrderId(nextMaxId);

          // Tạo các thông báo mới
          const newNotifications = newOrders.map(order => ({
            id: order.orderId,
            title: `Đơn hàng mới #${order.orderId}`,
            message: `Khách hàng ${order.customerName || 'Khách vãng lai'} vừa đặt đơn hàng trị giá ${order.totalAmount?.toLocaleString()}₫`,
            time: new Date().toISOString(),
            read: false
          }));

          // Cập nhật state thông báo (giới hạn 50 thông báo gần nhất)
          setNotifications(prev => {
            const updated = [...newNotifications, ...prev];
            return updated.slice(0, 50);
          });

          // Hiển thị Toast nổi
          newNotifications.forEach(notif => {
            const toastId = `${notif.id}-${Date.now()}`;
            setToasts(prev => [...prev, { ...notif, toastId }]);

            // Tự động đóng Toast sau 6 giây
            setTimeout(() => {
              setToasts(prev => prev.filter(t => t.toastId !== toastId));
            }, 6000);
          });
        }
      } catch (err) {
        console.error("Lỗi khi polling kiểm tra đơn hàng mới:", err);
      }
    }, 10000); // Polling mỗi 10 giây

    return () => clearInterval(intervalId);
  }, [maxOrderId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      
      <Topbar 
        toggleSidebar={toggleSidebar} 
        isCollapsed={isSidebarCollapsed}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <main 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-6">
          <Outlet context={{ newOrderTrigger }} />
        </div>
      </main>

      {/* Toast Container hiển thị thông báo nổi ở góc dưới bên phải */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => (
          <div 
            key={toast.toastId}
            onClick={() => {
              navigate('/admin/orders');
              // Đánh dấu thông báo này đã đọc
              setNotifications(prev => 
                prev.map(n => n.id === toast.id ? { ...n, read: true } : n)
              );
              // Tắt toast
              setToasts(prev => prev.filter(t => t.toastId !== toast.toastId));
            }}
            className="bg-white border-l-4 border-emerald-500 rounded-xl shadow-xl p-4 flex gap-3 items-start justify-between cursor-pointer hover:bg-emerald-50/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-gray-100 animate-slide-in"
          >
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 flex-shrink-0">
              <ShoppingBag size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h4 className="font-bold text-gray-900 text-sm">{toast.title}</h4>
              </div>
              <p className="text-gray-600 text-xs mt-1 leading-relaxed line-clamp-2">{toast.message}</p>
              <span className="text-[10px] text-gray-400 mt-2 block">Nhấp để xem chi tiết</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Không kích hoạt click vào Toast
                setToasts(prev => prev.filter(t => t.toastId !== toast.toastId));
              }}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLayout;

