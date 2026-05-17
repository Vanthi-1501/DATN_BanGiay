import React from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit } from 'lucide-react';

const Banners = () => {
  const banners = [
    { id: 1, title: 'Summer Sale 2026', image: 'https://via.placeholder.com/800x300?text=Summer+Sale', position: 'Homepage Slider', status: 'Active' },
    { id: 2, title: 'New Arrival Sneaker', image: 'https://via.placeholder.com/800x300?text=New+Arrival', position: 'Category Top', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các banner quảng cáo trên website</p>
        </div>
        <button className="bg-black hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          Thêm Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-sm transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-1.5 bg-white text-red-600 hover:bg-red-50 rounded-lg shadow-sm transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{banner.title}</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{banner.position}</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Hoạt động</span>
              </div>
            </div>
          </div>
        ))}

        {/* Empty add card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center h-full min-h-[250px] text-gray-400 hover:text-black hover:border-black hover:bg-gray-100 transition-colors cursor-pointer">
          <ImageIcon size={40} className="mb-2" />
          <span className="font-medium">Tải lên Banner mới</span>
        </div>
      </div>
    </div>
  );
};

export default Banners;
