import React from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình thông tin chung của website</p>
        </div>
        <button className="bg-black hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Save size={18} />
          Lưu Thay Đổi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* General Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Thông Tin Chung</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                  <input type="text" defaultValue="Vanthi Store" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                  <input type="email" defaultValue="contact@vanthistore.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại / Hotline</label>
                <input type="text" defaultValue="0123.456.789" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cửa hàng</label>
                <textarea rows="2" defaultValue="123 Đường ABC, Quận X, TP. Hồ Chí Minh" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"></textarea>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Mạng Xã Hội</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input type="url" defaultValue="https://facebook.com/vanthistore" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input type="url" defaultValue="https://instagram.com/vanthistore" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Logo settings */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Logo & Favicon</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Website</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors">
                  <span className="font-bold text-xl text-black tracking-tight mb-2">VANTHI<span className="text-red-600">.</span></span>
                  <span className="text-xs">Nhấn để thay đổi (PNG, JPG)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc chủ đạo</label>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-black cursor-pointer ring-2 ring-offset-2 ring-black"></div>
                  <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-600 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-green-600 cursor-pointer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
