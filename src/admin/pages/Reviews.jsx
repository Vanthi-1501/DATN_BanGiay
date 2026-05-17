import React from 'react';
import { Star, Search, Trash2, EyeOff } from 'lucide-react';

const Reviews = () => {
  const reviews = [
    { id: 1, user: 'Nguyen Van A', product: 'Nike Air Max 270', rating: 5, comment: 'Giày rất êm, giao hàng nhanh. Shop tư vấn nhiệt tình!', date: '2026-05-14' },
    { id: 2, user: 'Tran Thi B', product: 'Adidas Ultraboost', rating: 4, comment: 'Sản phẩm đẹp nhưng size hơi rộng một chút.', date: '2026-05-12' },
    { id: 3, user: 'Le Van C', product: 'Puma RS-X', rating: 2, comment: 'Đóng gói bị móp hộp, giày có vết xước nhỏ.', date: '2026-05-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý phản hồi và đánh giá từ khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo sản phẩm hoặc nội dung..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Khách Hàng</th>
                <th className="p-4 font-medium">Sản Phẩm</th>
                <th className="p-4 font-medium">Đánh Giá</th>
                <th className="p-4 font-medium w-1/3">Nội Dung</th>
                <th className="p-4 font-medium text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{review.user}</div>
                    <div className="text-gray-500 text-xs">{review.date}</div>
                  </td>
                  <td className="p-4 text-blue-600 font-medium hover:underline cursor-pointer">{review.product}</td>
                  <td className="p-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} className={i >= review.rating ? "text-gray-300" : ""} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{review.comment}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Ẩn đánh giá">
                        <EyeOff size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa đánh giá">
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

export default Reviews;
