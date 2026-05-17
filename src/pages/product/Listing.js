import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getAllProducts, getAllCategories, SEARCH_PRODUCTS_SMART } from '../../services/apiService';
import ProductItem from './ProductItem';

const Listing = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentCategoryName, setCurrentCategoryName] = useState("Tất cả sản phẩm");

    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    const brand = queryParams.get('brand');
    const minPrice = queryParams.get('minPrice');
    const maxPrice = queryParams.get('maxPrice');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine Mode: Search vs Category/Listing
                const isSearchMode = keyword || brand || minPrice || maxPrice;

                let productList = [];
                let categoriesData = [];

                if (isSearchMode) {
                    setCurrentCategoryName(keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Kết quả lọc");
                    const searchParams = {
                        keyword,
                        brand,
                        minPrice,
                        maxPrice,
                        limit: 50
                    };
                    const [searchData, cats] = await Promise.all([
                        SEARCH_PRODUCTS_SMART(searchParams),
                        getAllCategories()
                    ]);

                    if (searchData && (searchData.content || Array.isArray(searchData))) {
                        productList = Array.isArray(searchData) ? searchData : searchData.content;
                    }
                    categoriesData = cats;

                } else {
                    // Normal Category/Listing Mode
                    let params = { pageSize: 50 };
                    if (categoryId) params.categoryId = categoryId;

                    const [productsData, cats] = await Promise.all([
                        getAllProducts(params),
                        getAllCategories()
                    ]);

                    if (Array.isArray(productsData)) {
                        productList = productsData;
                    } else if (productsData && Array.isArray(productsData.content)) {
                        productList = productsData.content;
                    }
                    categoriesData = cats;

                    // Update Title based on Category ID
                    if (categoryId && cats) {
                        const catList = Array.isArray(cats) ? cats : cats.content || [];
                        const matchedCat = catList.find(c => (c.categoryId || c.id) == categoryId);
                        if (matchedCat) {
                            setCurrentCategoryName(matchedCat.categoryName || matchedCat.name);
                        } else {
                            setCurrentCategoryName("Danh mục");
                        }
                    } else {
                        setCurrentCategoryName("Tất cả sản phẩm");
                    }
                }

                setProducts(productList || []);

                // Handle Categories
                let categoryList = [];
                if (Array.isArray(categoriesData)) {
                    categoryList = categoriesData;
                } else if (categoriesData && Array.isArray(categoriesData.content)) {
                    categoryList = categoriesData.content;
                }
                setCategories(categoryList || []);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryId, keyword, brand, minPrice, maxPrice]); // Re-run when URL params change

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="section-content padding-y">
            <div className="container">

                <div className="card mb-3 border-0 shadow-sm">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2"> Bạn đang xem: </div>
                            <nav className="col-md-8">
                                <ol className="breadcrumb bg-white p-0">
                                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">{currentCategoryName}</li>
                                </ol>
                            </nav>
                        </div>
                        <hr />
                        {/* Filter Bar - kept as is for now, functionality to be added later */}
                        <div className="row">
                            <div className="col-md-2">Lọc theo</div>
                            <div className="col-md-10">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">   Nhà cung cấp </a>
                                            <div className="dropdown-menu">
                                                <a href="#" className="dropdown-item">Tùy chọn 1</a>
                                                <a href="#" className="dropdown-item">Tùy chọn 2</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">Tính năng</a>
                                            <div className="dropdown-menu">
                                                <a href="#" className="dropdown-item">Tùy chọn 1</a>
                                                <a href="#" className="dropdown-item">Tùy chọn 2</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <aside className="col-md-3">
                        <div className="card border-0 shadow-sm">
                            <article className="filter-group">
                                <header className="card-header bg-white border-bottom-0">
                                    <a href="#!" data-toggle="collapse" data-target="#collapse_1" aria-expanded="true" className="" onClick={(e) => e.preventDefault()}>
                                        <i className="icon-control fa fa-chevron-down"></i>
                                        <h6 className="title">Danh mục</h6>
                                    </a>
                                </header>
                                <div className="filter-content collapse show" id="collapse_1" style={{}}>
                                    <div className="card-body pt-0">
                                        <ul className="list-menu list-unstyled">
                                            {Array.isArray(categories) && categories.map((cat, index) => (
                                                <li key={index}>
                                                    <Link to={`/category/${cat.categoryId}`}>{cat.categoryName}</Link>
                                                </li>
                                            ))}
                                            {(!categories || categories.length === 0) && (
                                                <li><span className="text-muted">Không có danh mục</span></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </article>

                        </div>
                    </aside>
                    <main className="col-md-9">

                        <header className="border-bottom mb-4 pb-3">
                            <div className="form-inline">
                                <span className="mr-md-auto">Tìm thấy {products.length} sản phẩm </span>
                                <select className="mr-2 form-control">
                                    <option>Sản phẩm mới nhất</option>
                                    <option>Xu hướng</option>
                                    <option>Phổ biến nhất</option>
                                    <option>Rẻ nhất</option>
                                </select>
                                <div className="btn-group">
                                    <Link to="#!" className="btn btn-outline-secondary active" data-toggle="tooltip" title="Xem danh sách" onClick={(e) => e.preventDefault()}>
                                        <i className="fa fa-bars"></i>
                                    </Link>
                                    <Link to="/listing-grid" className="btn  btn-outline-secondary" data-toggle="tooltip" title="Xem lưới">
                                        <i className="fa fa-th"></i>
                                    </Link>
                                </div>
                            </div>
                        </header>

                        {Array.isArray(products) && products.length > 0 ? (
                            products.map((product) => {
                                let imageSrc = "https://placehold.co/150";
                                if (product.image) {
                                    if (product.image.startsWith('http')) {
                                        imageSrc = product.image;
                                    } else {
                                        imageSrc = `http://localhost:8080/api/public/products/image/${product.image}`;
                                    }
                                }

                                return (
                                    <article className="card card-product-list mb-3 border-0 shadow-sm" key={product.productId || product.id}>
                                        <div className="row no-gutters">
                                            <aside className="col-md-3">
                                                <Link to={`/product-detail/${product.productId || product.id}`} className="img-wrap">
                                                    {/* <span className="badge badge-danger"> MỚI </span> */}
                                                    <img
                                                        src={imageSrc}
                                                        alt={product.productName}
                                                        style={{ objectFit: 'cover' }}
                                                        onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=No+Image'; }}
                                                    />
                                                </Link>
                                            </aside>
                                            <div className="col-md-6">
                                                <div className="info-main">
                                                    <Link to={`/product-detail/${product.productId || product.id}`} className="h5 title"> {product.productName} </Link>
                                                    <div className="rating-wrap mb-3">
                                                        <ul className="rating-stars">
                                                            <li style={{ width: '80%' }} className="stars-active">
                                                                <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                            </li>
                                                            <li>
                                                                <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                                <i className="fa fa-star"></i>
                                                            </li>
                                                        </ul>
                                                        <div className="label-rating">7/10</div>
                                                    </div>

                                                    <p> {product.description} </p>
                                                </div>
                                            </div>
                                            <aside className="col-sm-3">
                                                <div className="info-aside">
                                                    <div className="price-wrap">
                                                        <span className="price h5"> {product.specialPrice ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}đ </span>
                                                        {product.specialPrice && <del className="price-old"> {product.price.toLocaleString()}đ</del>}
                                                    </div>
                                                    <p className="text-success">Miễn phí vận chuyển</p>
                                                    <br />
                                                    <p>
                                                        <Link to={`/product-detail/${product.productId || product.id}`} className="btn btn-primary btn-block"> Chi tiết </Link>
                                                        <Link to="#" className="btn btn-light btn-block"><i className="fa fa-heart"></i>
                                                            <span className="text">Yêu thích</span>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </aside>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="text-center mt-5">
                                <p>Không tìm thấy sản phẩm nào.</p>
                            </div>
                        )}

                        <nav className="mb-4" aria-label="Page navigation sample">
                            <ul className="pagination">
                                <li className="page-item disabled"><Link className="page-link" to="#">Trước</Link></li>
                                <li className="page-item active"><Link className="page-link" to="#">1</Link></li>
                                <li className="page-item"><Link className="page-link" to="#">Sau</Link></li>
                            </ul>
                        </nav>

                    </main>
                </div>
            </div>
        </section>
    );
};

export default Listing;
