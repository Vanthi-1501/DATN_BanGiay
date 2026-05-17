import React, { useState, useEffect } from 'react';
import { Search, Eye, Filter, Edit } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/orders?pageSize=100'); // Fetch more for admin
      setOrders(response.data.content || response.data || []);
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
          <button className="flex items-center gap-2 text-gray-600 hover:text-black px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white transition-colors">
            <Filter size={16} />
            Lọc & Sắp xếp
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
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
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
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
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hủy
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
