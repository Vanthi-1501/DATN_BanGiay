import React from 'react';
import { Plus, Search, Edit, Trash2, Tag } from 'lucide-react';

const Coupons = () => {
  const coupons = [
    { id: 1, code: 'SUMMER2026', discount: '20%', minOrder: 500000, start: '2026-06-01', end: '2026-06-30', status: 'Active' },
    { id: 2, code: 'FREESHIP', discount: '30,000đ', minOrder: 300000, start: '2026-05-01', end: '2026-12-31', status: 'Active' },
    { id: 3, code: 'TET2026', discount: '50%', minOrder: 1000000, start: '2026-01-01', end: '2026-01-31', status: 'Expired' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mã Khuyến Mãi</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các chương trình giảm giá, voucher</p>
        </div>
        <button className="bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          Thêm Mã Khuyến Mãi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm mã code..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Mã Khuyến Mãi</th>
                <th className="p-4 font-medium">Giảm Giá</th>
                <th className="p-4 font-medium">Đơn Tối Thiểu</th>
                <th className="p-4 font-medium">Thời Gian</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2 font-bold text-gray-900">
                      <Tag size={16} className="text-red-500" />
                      {coupon.code}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-red-600">{coupon.discount}</td>
                  <td className="p-4 text-gray-600">{coupon.minOrder.toLocaleString()}đ</td>
                  <td className="p-4 text-gray-500 text-xs">
                    <div>Từ: {coupon.start}</div>
                    <div>Đến: {coupon.end}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      coupon.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {coupon.status === 'Active' ? 'Đang chạy' : 'Đã hết hạn'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
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

export default Coupons;
