import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Filter, Package, X, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: 0,
    discount: 0,
    quantity: 0,
    categoryId: ''
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, filterCategoryId]); // Re-fetch on page or category change

  // Delay search to avoid spamming API
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPageNumber(0); // Reset to page 0 when searching
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/public/categories');
      setCategories(response.data.content || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = '';
      if (keyword.trim() !== '') {
        url = `/public/products/keyword/${encodeURIComponent(keyword)}?pageNumber=${pageNumber}&pageSize=10`;
      } else {
        url = `/public/products?pageNumber=${pageNumber}&pageSize=10`;
        if (filterCategoryId) {
          url += `&categoryId=${filterCategoryId}`;
        }
      }
      const response = await axiosInstance.get(url);
      setProducts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalElements(response.data.totalElements || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      productName: '', description: '', price: 0, discount: 0, quantity: 0, 
      categoryId: categories.length > 0 ? categories[0].categoryId : ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      quantity: product.quantity,
      categoryId: product.categoryId || (categories.length > 0 ? categories[0].categoryId : '')
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axiosInstance.delete(`/admin/products/${productId}`);
        alert("Xóa sản phẩm thành công!");
        fetchProducts();
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Lỗi khi xóa sản phẩm!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Vui lòng chọn danh mục!");
      return;
    }

    try {
      let savedProductId = null;
      if (editingProduct) {
        // Edit
        const response = await axiosInstance.put(`/admin/products/${editingProduct.productId}`, formData);
        savedProductId = editingProduct.productId;
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // Add
        const response = await axiosInstance.post(`/admin/categories/${formData.categoryId}/products`, formData);
        savedProductId = response.data.productId;
        alert("Thêm sản phẩm thành công!");
      }

      // Upload Image if selected
      if (imageFile && savedProductId) {
        const imgData = new FormData();
        imgData.append("image", imageFile);
        await axiosInstance.put(`/admin/products/${savedProductId}/image`, imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert("Lỗi khi lưu sản phẩm! " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý danh sách giày, thêm sửa xóa</p>
        </div>
        <button onClick={openAddModal} className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} />
          Thêm Sản Phẩm
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-500" />
            <select 
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none w-full sm:w-auto bg-white"
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Mã SP</th>
                <th className="p-4 font-medium">Tên Sản Phẩm</th>
                <th className="p-4 font-medium hidden sm:table-cell">Mô tả</th>
                <th className="p-4 font-medium">Giá bán</th>
                <th className="p-4 font-medium">Tồn Kho</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Không tìm thấy sản phẩm nào.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">#{product.productId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          {product.image ? (
                            <img src={product.image.startsWith('http') ? product.image : `http://localhost:8080/api/public/products/image/${product.image}`} alt={product.productName} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{product.productName}</div>
                          <div className="text-xs text-gray-500 mt-1">DM: {categories.find(c => c.categoryId === product.categoryId)?.categoryName || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell max-w-[200px] truncate">
                      {product.description || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{product.price?.toLocaleString()}₫</div>
                      {product.discount > 0 && <div className="text-xs text-red-500">-{product.discount}%</div>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.productId)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div>Tổng: <span className="font-bold text-gray-900">{totalElements}</span> sản phẩm</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
              disabled={pageNumber === 0}
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Trước
            </button>
            <span className="px-3 py-1.5 font-medium text-gray-900">
              Trang {pageNumber + 1} / {totalPages === 0 ? 1 : totalPages}
            </span>
            <button 
              onClick={() => setPageNumber(Math.min(totalPages - 1, pageNumber + 1))}
              disabled={pageNumber >= totalPages - 1}
              className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 hover:bg-gray-200 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                    placeholder="VD: Nike Air Force 1"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none bg-white"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tồn kho <span className="text-red-500">*</span></label>
                    <input 
                      type="number" min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Giá bán (₫) <span className="text-red-500">*</span></label>
                    <input 
                      type="number" min="0" step="1000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Giảm giá (%)</label>
                    <input 
                      type="number" min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả sản phẩm</label>
                  <textarea 
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none resize-none"
                    rows="3"
                    placeholder="Mô tả chi tiết (ít nhất 6 ký tự)..."
                    minLength="6"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon size={24} className="text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Tải ảnh lên</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                    </label>
                    
                    {imageFile ? (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : editingProduct?.image ? (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                        <img src={editingProduct.image.startsWith('http') ? editingProduct.image : `http://localhost:8080/api/public/products/image/${editingProduct.image}`} alt="Current" className="w-full h-full object-cover" />
                      </div>
                    ) : null}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 5MB)</p>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button type="submit" form="productForm" className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors">
                {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
