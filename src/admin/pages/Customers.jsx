import React from 'react';
import { Search, Mail, Phone, Lock } from 'lucide-react';

const Customers = () => {
  const customers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0987654321', totalOrders: 5, spent: 1250, status: 'Active' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', totalOrders: 2, spent: 450, status: 'Active' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0909090909', totalOrders: 0, spent: 0, status: 'Locked' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách Hàng</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý tài khoản khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email, SĐT..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Khách Hàng</th>
                <th className="p-4 font-medium">Liên Hệ</th>
                <th className="p-4 font-medium">Tổng Đơn</th>
                <th className="p-4 font-medium">Chi Tiêu</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {customers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 space-y-1">
                    <div className="flex items-center gap-2"><Mail size={14}/> {user.email}</div>
                    <div className="flex items-center gap-2"><Phone size={14}/> {user.phone}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">{user.totalOrders}</td>
                  <td className="p-4 font-medium text-gray-900">${user.spent}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 'Active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={user.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}>
                      <Lock size={18} />
                    </button>
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

export default Customers;
