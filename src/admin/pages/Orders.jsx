import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Edit, Trash2 } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';
import { useOutletContext } from 'react-router-dom';

const Orders = () => {
  const { newOrderTrigger } = useOutletContext() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Tự động tải lại danh sách khi có thông báo đơn hàng mới
  useEffect(() => {
    if (newOrderTrigger) {
      fetchOrders();
    }
  }, [newOrderTrigger]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/orders?pageSize=100&sortBy=orderId&sortOrder=desc'); // Fetch more for admin, sort newest first
      const fetchedOrders = response.data.content || response.data || [];
      // Sắp xếp dự phòng ở frontend để đảm bảo hiển thị đơn hàng mới nhất lên trên cùng
      const sortedOrders = [...fetchedOrders].sort((a, b) => b.orderId - a.orderId);
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (!newStatus) return;
    
    if (window.confirm(`Bạn muốn đổi trạng thái đơn hàng #${orderId} thành ${newStatus}?`)) {
      try {
        await axiosInstance.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
        alert("Cập nhật trạng thái thành công!");
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
        alert("Lỗi khi cập nhật!");
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc muốn HỦY đơn hàng #${orderId} không?`)) {
      try {
        await axiosInstance.put(`/admin/orders/${orderId}`, { orderStatus: "CANCELLED" });
        alert("Đã hủy đơn hàng!");
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Lỗi khi hủy!");
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN đơn hàng #${orderId}? Thao tác này sẽ xóa sạch bản ghi và không thể hoàn tác!`)) {
      try {
        await axiosInstance.delete(`/admin/orders/${orderId}`);
        alert("Đã xóa đơn hàng thành công!");
        setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
        alert("Lỗi khi xóa đơn hàng!");
      }
    }
  };

  const handleDeleteSelected = async () => {
    const count = selectedOrderIds.length;
    if (window.confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${count} đơn hàng đã chọn? Hành động này sẽ xóa vĩnh viễn và không thể khôi phục!`)) {
      try {
        setLoading(true);
        // Gửi song song các yêu cầu xóa
        await Promise.all(selectedOrderIds.map(id => axiosInstance.delete(`/admin/orders/${id}`)));
        alert(`Đã xóa thành công ${count} đơn hàng!`);
        setSelectedOrderIds([]);
        fetchOrders();
      } catch (error) {
        console.error("Lỗi khi xóa hàng loạt đơn hàng:", error);
        alert("Có lỗi xảy ra trong quá trình xóa một số đơn hàng!");
        fetchOrders();
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toUpperCase();
    switch (s) {
      case 'PENDING':
      case 'PENDING_PAYMENT': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-orange-100 text-orange-800';
      case 'SHIPPING': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = ['PENDING_PAYMENT', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.orderId?.toString().includes(searchLower) ||
      order.email?.toLowerCase().includes(searchLower) ||
      order.customerName?.toLowerCase().includes(searchLower)
    );
  });

  const isAllSelected = filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map(o => o.orderId));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi và cập nhật trạng thái đơn hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã đơn, email, tên..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {selectedOrderIds.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-all shadow-sm font-semibold hover:scale-105 active:scale-95 animate-pulse"
              >
                <Trash2 size={16} />
                Xóa đã chọn ({selectedOrderIds.length})
              </button>
            )}
            <button className="flex items-center gap-2 text-gray-600 hover:text-black px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white transition-colors">
              <Filter size={16} />
              Lọc & Sắp xếp
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-black focus:ring-black cursor-pointer w-4 h-4 animate-scale-in"
                  />
                </th>
                <th className="p-4 font-medium">Mã Đơn</th>
                <th className="p-4 font-medium">Ngày Đặt</th>
                <th className="p-4 font-medium">Khách Hàng</th>
                <th className="p-4 font-medium">Tổng Tiền</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.orderId} className={`hover:bg-gray-50/50 transition-colors ${selectedOrderIds.includes(order.orderId) ? 'bg-red-50/10' : ''}`}>
                  <td className="p-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedOrderIds.includes(order.orderId)}
                      onChange={() => handleSelectOrder(order.orderId)}
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="p-4 font-bold text-gray-900">#{order.orderId}</td>
                  <td className="p-4 text-gray-600">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.customerName || 'Khách Vãng Lai'}</div>
                    <div className="text-gray-500 text-xs">{order.email}</div>
                  </td>
                  <td className="p-4 text-gray-900 font-bold">
                    {order.totalAmount?.toLocaleString()}₫
                    <div className="text-xs font-normal text-gray-500 mt-1">{order.paymentMethod}</div>
                  </td>
                  <td className="p-4">
                    <select 
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold outline-none cursor-pointer border-0 shadow-sm ${getStatusColor(order.orderStatus)}`}
                      value={order.orderStatus || 'PENDING'}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt} className="bg-white text-gray-900">{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hủy
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
