import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAllCategories, SEARCH_PRODUCTS_SMART } from '../../services/apiService';

const Listing = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Parse URL params
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const brand = queryParams.get('brand') || '';
    const minPrice = queryParams.get('minPrice') || '';
    const maxPrice = queryParams.get('maxPrice') || '';
    const size = queryParams.get('size') || '';
    const sort = queryParams.get('sort') || 'newest';

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm");

    // Local inputs (for price range or refine keyword before clicking "Lọc")
    const [localMinPrice, setLocalMinPrice] = useState(minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
    const [localKeyword, setLocalKeyword] = useState(keyword);

    // Dynamic brand list from loaded products (to make it look alive) or static list
    const brandOptions = ["Nike", "Adidas", "Converse", "Jordan", "Puma", "New Balance"];
    const sizeOptions = [38, 39, 40, 41, 42, 43, 44, 45];

    // Reset all inputs when URL changes
    useEffect(() => {
        setLocalKeyword(keyword);
        setLocalMinPrice(minPrice);
        setLocalMaxPrice(maxPrice);
    }, [keyword, minPrice, maxPrice]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const cats = await getAllCategories();
                let categoryList = [];
                if (Array.isArray(cats)) {
                    categoryList = cats;
                } else if (cats && Array.isArray(cats.content)) {
                    categoryList = cats.content;
                }
                setCategories(categoryList);

                // Determine Current Category Display Name
                if (categoryId) {
                    const matchedCat = categoryList.find(c => (c.categoryId || c.id) == categoryId);
                    if (matchedCat) {
                        setCurrentCategoryName(matchedCat.categoryName || matchedCat.name);
                    } else {
                        setCurrentCategoryName("Danh mục");
                    }
                } else if (keyword) {
                    setCurrentCategoryName(`Tìm kiếm: "${keyword}"`);
                } else {
                    setCurrentCategoryName("Tất cả sản phẩm");
                }

                // Prepare params for API call
                const searchParams = {
                    keyword: keyword || undefined,
                    brand: brand || undefined,
                    minPrice: minPrice ? parseFloat(minPrice) : undefined,
                    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                    size: size ? parseInt(size) : undefined,
                    sort: sort || undefined,
                    categoryId: categoryId ? parseInt(categoryId) : undefined,
                    limit: 50
                };

                const searchData = await SEARCH_PRODUCTS_SMART(searchParams);
                let productList = [];
                if (searchData) {
                    if (Array.isArray(searchData)) {
                        productList = searchData;
                    } else if (Array.isArray(searchData.content)) {
                        productList = searchData.content;
                    }
                }
                setProducts(productList);

            } catch (error) {
                console.error("Error fetching filtered data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, keyword, brand, minPrice, maxPrice, size, sort]);

    // Apply filter helper
    const applyFilters = (newParams = {}) => {
        const params = new URLSearchParams();

        // Merge inputs
        const kw = newParams.hasOwnProperty('keyword') ? newParams.keyword : localKeyword;
        const b = newParams.hasOwnProperty('brand') ? newParams.brand : brand;
        const minP = newParams.hasOwnProperty('minPrice') ? newParams.minPrice : localMinPrice;
        const maxP = newParams.hasOwnProperty('maxPrice') ? newParams.maxPrice : localMaxPrice;
        const s = newParams.hasOwnProperty('size') ? newParams.size : size;
        const sr = newParams.hasOwnProperty('sort') ? newParams.sort : sort;

        if (kw) params.set('keyword', kw);
        if (b) params.set('brand', b);
        if (minP) params.set('minPrice', minP);
        if (maxP) params.set('maxPrice', maxP);
        if (s) params.set('size', s);
        if (sr) params.set('sort', sr);

        if (categoryId) {
            navigate(`/category/${categoryId}?${params.toString()}`);
        } else {
            navigate(`/listing?${params.toString()}`);
        }
    };

    // Toggle specific filter values directly
    const handleBrandClick = (bName) => {
        const nextBrand = (brand === bName) ? '' : bName; // Toggle off if clicked again
        applyFilters({ brand: nextBrand });
    };

    const handleSizeClick = (sNum) => {
        const nextSize = (size == sNum) ? '' : sNum.toString();
        applyFilters({ size: nextSize });
    };

    const handleSortChange = (e) => {
        applyFilters({ sort: e.target.value });
    };

    const resetAllFilters = () => {
        setLocalMinPrice('');
        setLocalMaxPrice('');
        setLocalKeyword('');
        if (categoryId) {
            navigate(`/category/${categoryId}`);
        } else {
            navigate(`/listing`);
        }
    };

    // Quick price selection ranges
    const quickPriceRanges = [
        { label: "Dưới 2Tr", min: "0", max: "2000000" },
        { label: "2Tr - 4Tr", min: "2000000", max: "4000000" },
        { label: "4Tr - 6Tr", min: "4000000", max: "6000000" },
        { label: "Trên 6Tr", min: "6000000", max: "25000000" }
    ];

    return (
        <section className="section-content padding-y" style={{ marginTop: '70px', minHeight: '80vh', backgroundColor: '#f8f9fa' }}>
            {/* Inject Modern CSS for stunning design */}
            <style dangerouslySetInnerHTML={{ __html: `
                .premium-sidebar {
                    background: #ffffff;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .filter-title {
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    color: #111;
                    font-size: 15px;
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .category-link-premium {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 14px;
                    border-radius: 12px;
                    color: #333;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    text-decoration: none !important;
                    margin-bottom: 4px;
                }
                .category-link-premium:hover {
                    background: #f1f3f5;
                    transform: translateX(4px);
                    color: #000;
                }
                .category-link-premium.active {
                    background: #111;
                    color: #fff !important;
                    font-weight: 600;
                }
                .brand-pill-premium {
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 30px;
                    background: #f1f3f5;
                    color: #495057;
                    font-size: 13px;
                    font-weight: 600;
                    margin-right: 8px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid transparent;
                }
                .brand-pill-premium:hover {
                    background: #e9ecef;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }
                .brand-pill-premium.active {
                    background: #000;
                    color: #fff;
                    border-color: #000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .size-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }
                .size-box-premium {
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #ffffff;
                    border: 1.5px solid #dee2e6;
                    color: #212529;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .size-box-premium:hover {
                    border-color: #000;
                    background: #f8f9fa;
                    transform: scale(1.05);
                }
                .size-box-premium.active {
                    background: #000;
                    color: #fff;
                    border-color: #000;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }
                .price-range-input {
                    background: #f8f9fa;
                    border: 1.5px solid #e9ecef;
                    border-radius: 12px;
                    padding: 10px 14px;
                    font-size: 13px;
                    font-weight: 600;
                    width: 100%;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .price-range-input:focus {
                    border-color: #000;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
                }
                .price-pill-quick {
                    display: inline-block;
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: #e9ecef;
                    color: #495057;
                    font-size: 12px;
                    font-weight: 600;
                    margin-right: 6px;
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .price-pill-quick:hover {
                    background: #dee2e6;
                    color: #000;
                }
                .price-pill-quick.active {
                    background: #dc3545;
                    color: #fff;
                }
                .btn-apply-premium {
                    background: #000;
                    color: #fff;
                    border-radius: 12px;
                    padding: 12px;
                    font-weight: 700;
                    font-size: 14px;
                    border: none;
                    width: 100%;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .btn-apply-premium:hover {
                    background: #222;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                }
                .product-card-premium {
                    background: #ffffff;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .product-card-premium:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                }
                .premium-img-wrap {
                    position: relative;
                    height: 230px;
                    background: #f1f3f5;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .premium-img-wrap img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .product-card-premium:hover .premium-img-wrap img {
                    transform: scale(1.08);
                }
                .badge-premium {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: #dc3545;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 30px;
                    letter-spacing: 0.5px;
                }
            ` }} />

            <div className="container" style={{ maxWidth: '1400px' }}>
                {/* Breadcrumb Navigation */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent p-0 m-0" style={{ fontSize: '14px' }}>
                            <li className="breadcrumb-item"><Link to="/" className="text-dark opacity-50 text-decoration-none">Trang chủ</Link></li>
                            <li className="breadcrumb-item active text-dark font-weight-bold" aria-current="page">{currentCategoryName}</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    {/* Left Sidebar: Filter Panel */}
                    <aside className="col-lg-3 mb-4">
                        <div className="premium-sidebar">
                            
                            {/* Filter by Category */}
                            <div className="filter-group mb-4">
                                <h6 className="filter-title">
                                    <span>Danh mục</span>
                                    <i className="fa fa-folder-open text-muted"></i>
                                </h6>
                                <div className="mt-2">
                                    <Link to="/listing" className={`category-link-premium ${!categoryId ? 'active' : ''}`}>
                                        Tất cả sản phẩm
                                        <span className="badge badge-pill badge-light text-dark">ALL</span>
                                    </Link>
                                    {Array.isArray(categories) && categories.map((cat) => (
                                        <Link 
                                            key={cat.categoryId || cat.id} 
                                            to={`/category/${cat.categoryId || cat.id}`} 
                                            className={`category-link-premium ${categoryId == (cat.categoryId || cat.id) ? 'active' : ''}`}
                                        >
                                            {cat.categoryName}
                                            <i className="fa fa-chevron-right small opacity-50"></i>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4" style={{ borderColor: '#f1f3f5' }} />

                            {/* Search Refinement */}
                            <div className="filter-group mb-4">
                                <h6 className="filter-title">
                                    <span>Từ khóa</span>
                                    <i className="fa fa-search text-muted"></i>
                                </h6>
                                <div className="position-relative">
                                    <input 
                                        type="text" 
                                        className="price-range-input" 
                                        placeholder="Tìm giày, màu sắc..." 
                                        value={localKeyword}
                                        onChange={(e) => setLocalKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    />
                                </div>
                            </div>

                            <hr className="my-4" style={{ borderColor: '#f1f3f5' }} />

                            {/* Filter by Price Range */}
                            <div className="filter-group mb-4">
                                <h6 className="filter-title">
                                    <span>Khoảng giá (VND)</span>
                                    <i className="fa fa-tag text-muted"></i>
                                </h6>
                                
                                {/* Quick Range Pills */}
                                <div className="mb-3">
                                    {quickPriceRanges.map((range, index) => {
                                        const isQuickActive = minPrice === range.min && maxPrice === range.max;
                                        return (
                                            <button 
                                                key={index}
                                                type="button" 
                                                className={`price-pill-quick ${isQuickActive ? 'active' : ''}`}
                                                onClick={() => {
                                                    setLocalMinPrice(range.min);
                                                    setLocalMaxPrice(range.max);
                                                    applyFilters({ minPrice: range.min, maxPrice: range.max });
                                                }}
                                            >
                                                {range.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Manual Inputs */}
                                <div className="row no-gutters align-items-center gap-2">
                                    <div className="col">
                                        <input 
                                            type="number" 
                                            className="price-range-input" 
                                            placeholder="Từ đ" 
                                            value={localMinPrice}
                                            onChange={(e) => setLocalMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-auto text-muted px-2" style={{ fontWeight: 'bold' }}>–</div>
                                    <div className="col">
                                        <input 
                                            type="number" 
                                            className="price-range-input" 
                                            placeholder="Đến đ" 
                                            value={localMaxPrice}
                                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" style={{ borderColor: '#f1f3f5' }} />

                            {/* Filter by Brands */}
                            <div className="filter-group mb-4">
                                <h6 className="filter-title">
                                    <span>Thương hiệu</span>
                                    <i className="fa fa-copyright text-muted"></i>
                                </h6>
                                <div className="mt-2">
                                    {brandOptions.map((bName) => (
                                        <button 
                                            key={bName}
                                            type="button"
                                            className={`brand-pill-premium ${brand.toLowerCase() === bName.toLowerCase() ? 'active' : ''}`}
                                            onClick={() => handleBrandClick(bName)}
                                        >
                                            {bName}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="my-4" style={{ borderColor: '#f1f3f5' }} />

                            {/* Filter by Shoe Sizes */}
                            <div className="filter-group mb-4">
                                <h6 className="filter-title">
                                    <span>Kích cỡ (Size)</span>
                                    <i className="fa fa-arrows-alt text-muted"></i>
                                </h6>
                                <div className="size-grid-premium mt-2">
                                    {sizeOptions.map((sNum) => (
                                        <button 
                                            key={sNum}
                                            type="button"
                                            className={`size-box-premium ${size == sNum ? 'active' : ''}`}
                                            onClick={() => handleSizeClick(sNum)}
                                        >
                                            {sNum}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 pt-2">
                                <button className="btn-apply-premium mb-2" onClick={() => applyFilters()}>
                                    <i className="fa fa-filter mr-2"></i> Áp dụng lọc
                                </button>
                                <button className="btn btn-outline-secondary btn-block" style={{ borderRadius: '12px', fontSize: '13px', padding: '10px' }} onClick={resetAllFilters}>
                                    Đặt lại bộ lọc
                                </button>
                            </div>

                        </div>
                    </aside>

                    {/* Right Panel: Sorting and Product Grid */}
                    <main className="col-lg-9">
                        
                        {/* Control & Sorting Panel */}
                        <header className="d-flex flex-wrap align-items-center justify-content-between mb-4 p-3 bg-white" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <div className="py-2">
                                <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>
                                    Tìm thấy <strong className="text-dark">{products.length}</strong> sản phẩm phù hợp
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted small" style={{ whiteSpace: 'nowrap' }}>Sắp xếp theo:</span>
                                <select 
                                    className="form-control" 
                                    style={{ width: '220px', borderRadius: '12px', height: '42px', fontSize: '13.5px', fontWeight: '600', backgroundColor: '#f8f9fa', border: 'none' }}
                                    value={sort}
                                    onChange={handleSortChange}
                                >
                                    <option value="newest">Sản phẩm mới nhất</option>
                                    <option value="best_seller">Bán chạy nhất</option>
                                    <option value="price_asc">Giá: Thấp đến Cao</option>
                                    <option value="price_desc">Giá: Cao đến Thấp</option>
                                    <option value="discount">Khuyến mãi tốt nhất</option>
                                </select>
                            </div>
                        </header>

                        {/* Product Grid View (Extremely Premium Layout) */}
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="sr-only">Đang tải dữ liệu...</span>
                                </div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="row">
                                {products.map((product) => {
                                    let imageSrc = "https://placehold.co/300x300?text=No+Image";
                                    if (product.image) {
                                        if (product.image.startsWith('http')) {
                                            imageSrc = product.image;
                                        } else {
                                            imageSrc = `${process.env.REACT_APP_API_BASE_URL}/api/public/products/image/${product.image}`;
                                        }
                                    }

                                    // Calc discount label
                                    const hasDiscount = product.discount && product.discount > 0;

                                    return (
                                        <div className="col-md-4 mb-4" key={product.productId || product.id}>
                                            <div className="product-card-premium h-100 d-flex flex-column">
                                                
                                                {/* Image wrap */}
                                                <div className="premium-img-wrap">
                                                    {hasDiscount && (
                                                        <span className="badge-premium">
                                                            -{Math.round((product.discount / product.price) * 100)}% OFF
                                                        </span>
                                                    )}
                                                    <Link to={`/product-detail/${product.productId || product.id}`} className="w-100 h-100">
                                                        <img
                                                            src={imageSrc}
                                                            alt={product.productName}
                                                            onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-3 d-flex flex-column flex-grow-1">
                                                    
                                                    {/* Brand & Stock */}
                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                        <span className="text-muted text-uppercase font-weight-bold" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
                                                            {product.brand || "Nike Shop"}
                                                        </span>
                                                        <span className="text-success small font-weight-bold" style={{ fontSize: '11px' }}>
                                                            Size: {product.size || "Free"}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h6 className="mb-2" style={{ lineHeight: '1.4' }}>
                                                        <Link 
                                                            to={`/product-detail/${product.productId || product.id}`} 
                                                            className="text-dark font-weight-bold text-decoration-none"
                                                            style={{ fontSize: '15px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px' }}
                                                        >
                                                            {product.productName}
                                                        </Link>
                                                    </h6>

                                                    {/* Description */}
                                                    <p className="text-muted mb-3" style={{ fontSize: '12px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '36px' }}>
                                                        {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                                                    </p>

                                                    {/* Price & Action */}
                                                    <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between" style={{ borderColor: '#f1f3f5' }}>
                                                        <div className="price-wrap">
                                                            <div className="font-weight-bold text-danger" style={{ fontSize: '16px' }}>
                                                                {product.specialPrice ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}đ
                                                            </div>
                                                            {product.specialPrice && (
                                                                <del className="text-muted small">
                                                                    {product.price.toLocaleString()}đ
                                                                </del>
                                                            )}
                                                        </div>
                                                        <Link 
                                                            to={`/product-detail/${product.productId || product.id}`} 
                                                            className="btn btn-sm btn-dark rounded-pill px-3" 
                                                            style={{ fontWeight: '600', fontSize: '12px' }}
                                                        >
                                                            Chi tiết
                                                        </Link>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-5 bg-white mb-4" style={{ borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                                <i className="fa fa-search text-muted mb-3" style={{ fontSize: '40px' }}></i>
                                <h5 className="font-weight-bold">Không tìm thấy sản phẩm nào</h5>
                                <p className="text-muted small">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                                <button className="btn btn-sm btn-dark rounded-pill px-4 mt-2" onClick={resetAllFilters}>
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}

                        {/* Pagination (Styled nicely) */}
                        {products.length > 0 && (
                            <nav className="d-flex justify-content-center mt-4">
                                <ul className="pagination" style={{ gap: '6px' }}>
                                    <li className="page-item disabled">
                                        <button className="page-link border-0 text-dark" style={{ borderRadius: '10px', fontWeight: '600', background: '#e9ecef' }}>Trước</button>
                                    </li>
                                    <li className="page-item active">
                                        <button className="page-link border-0 text-white" style={{ borderRadius: '10px', fontWeight: '600', background: '#000' }}>1</button>
                                    </li>
                                    <li className="page-item disabled">
                                        <button className="page-link border-0 text-dark" style={{ borderRadius: '10px', fontWeight: '600', background: '#e9ecef' }}>Sau</button>
                                    </li>
                                </ul>
                            </nav>
                        )}

                    </main>
                </div>
            </div>
        </section>
    );
};

export default Listing;
