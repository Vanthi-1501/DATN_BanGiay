import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tags, X } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ categoryName: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/public/categories');
      setCategories(response.data.content || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) {
      alert("Tên danh mục không được để trống!");
      return;
    }

    try {
      if (editId) {
        await axiosInstance.put(`/admin/categories/${editId}`, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await axiosInstance.post('/admin/categories', formData);
        alert("Thêm danh mục thành công!");
      }
      setFormData({ categoryName: '', description: '' });
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      alert("Lỗi khi lưu danh mục! " + (error.response?.data?.message || ""));
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.categoryId);
    setFormData({ categoryName: cat.categoryName, description: cat.description || '' });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ categoryName: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axiosInstance.delete(`/admin/categories/${id}`);
        alert("Xóa danh mục thành công!");
        fetchCategories();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        alert("Lỗi khi xóa! Có thể danh mục này đang chứa sản phẩm.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh Mục Sản Phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các danh mục giày</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form Thêm/Sửa */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editId ? "Sửa Danh Mục" : "Thêm Mới"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none" 
                placeholder="Nhập tên..." 
                value={formData.categoryName}
                onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none" 
                rows="3" 
                placeholder="Mô tả..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                {editId ? "Cập Nhật" : "Lưu Danh Mục"}
              </button>
              {editId && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Table */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="p-4 font-medium w-16">ID</th>
                  <th className="p-4 font-medium">Tên Danh Mục</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Mô Tả</th>
                  <th className="p-4 font-medium text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">Đang tải...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">Chưa có danh mục nào.</td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat.categoryId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">#{cat.categoryId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                          <Tags size={14} className="text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900">{cat.categoryName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">{cat.description || 'Không có mô tả'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.categoryId)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
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
    </div>
  );
};

export default Categories;
