import React, { useEffect, useState } from 'react';
import Slider from '../pages/home/SliderSection';
import Product from './Product';
import Category from './Category';
import { getAllCategories, getAllProducts } from '../services/apiService';

function Home(props) {
    const [categories, setCategories] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const [onSaleProducts, setOnSaleProducts] = useState([]);

    useEffect(() => {
        // Fetch Categories
        getAllCategories({ pageNumber: 0, pageSize: 8 })
            .then(data => {
                setCategories(data.content || (Array.isArray(data) ? data : []));
            })
            .catch(err => console.error("Error fetching categories:", err));

        // Fetch New Arrivals (Page 0, Sort by productId DESC)
        getAllProducts({ pageNumber: 0, pageSize: 4, sortBy: 'productId', sortOrder: 'desc' })
            .then(data => {
                setNewArrivals(data.content || (Array.isArray(data) ? data : []));
            })
            .catch(err => console.error("Error fetching new arrivals:", err));

        // Fetch On Sale / Flash Sale
        getAllProducts({ pageNumber: 0, pageSize: 4, sortBy: 'price', sortOrder: 'asc' })
            .then(data => {
                setOnSaleProducts(data.content || (Array.isArray(data) ? data : []));
            })
            .catch(err => console.error("Error fetching sale products:", err));

        // Fetch Suggested
        getAllProducts({ pageNumber: 1, pageSize: 4, sortBy: 'productId', sortOrder: 'desc' })
            .then(data => {
                setSuggestedProducts(data.content || (Array.isArray(data) ? data : []));
            })
            .catch(err => console.error("Error fetching suggested products:", err));

    }, []);

    return (
        <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
            {/* Hero Section - Full Width */}
            <Slider />

            {/* Trust Badges */}
            <section className="py-4 border-bottom bg-white">
                <div className="container">
                    <div className="row g-3">
                        {[
                            { icon: 'fa-truck', title: 'Miễn Phí Giao Hàng', desc: 'Đơn hàng > 2tr' },
                            { icon: 'fa-check-shield', title: 'Chính Hãng 100%', desc: 'Hoàn tiền nếu fake' },
                            { icon: 'fa-exchange-alt', title: 'Đổi Trả 30 Ngày', desc: 'Thủ tục đơn giản' },
                            { icon: 'fa-headset', title: 'Hỗ Trợ 24/7', desc: 'Hotline: 1900 xxxx' }
                        ].map((item, i) => (
                            <div className="col-lg-3 col-6" key={i}>
                                <div className="d-flex align-items-center justify-content-center justify-content-lg-start p-2">
                                    <i className={`fa ${item.icon} text-danger mr-3`} style={{ fontSize: '1.2rem' }}></i>
                                    <div>
                                        <h6 className="mb-0 font-weight-bold" style={{ fontSize: '0.9rem' }}>{item.title}</h6>
                                        <small className="text-muted" style={{ fontSize: '0.8rem' }}>{item.desc}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container py-5">
                <div className="row">
                    {/* Sidebar Area */}
                    <aside className="col-lg-3">
                        {/* Categories Widget */}
                        <div className="card mb-4 border-0 shadow-sm">
                            <article className="filter-group">
                                <header className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0">
                                    <h5 className="title font-weight-bold text-uppercase small" style={{ letterSpacing: '1px' }}>
                                        Danh Mục
                                    </h5>
                                </header>
                                <div className="filter-content px-3 pb-4">
                                    <div className="list-menu list-unstyled mt-3">
                                        {categories.length > 0 ? (
                                            categories.map((category, index) => (
                                                <a key={index} href={`/category/${category.categoryId || category.id}`} className="d-block py-2 text-muted text-decoration-none border-bottom transition-all hover-primary">
                                                    <i className="fa fa-angle-right mr-2 text-muted"></i>
                                                    {category.categoryName || category.name}
                                                </a>
                                            ))
                                        ) : <p className="text-muted small">Đang tải...</p>}
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Banner Widget (Optional) */}
                        <div className="card bg-danger text-white border-0 shadow-sm mb-4 overflow-hidden position-relative">
                            <img
                                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?fit=crop&w=400&q=80"
                                className="card-img opacity-20"
                                alt="Banner"
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                                <h5 className="card-title font-weight-bold">Summer Sale</h5>
                                <p className="card-text small">Giảm giá đến 50% cho các sản phẩm mùa hè.</p>
                                <a href="/listing" className="btn btn-sm btn-light rounded-pill w-50 font-weight-bold">Mua Ngay</a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="col-lg-9">

                        {/* Section: New Arrivals */}
                        <header className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                            <h4 className="font-weight-bold mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>Hàng Mới Về</h4>
                            <a href="/listing" className="btn btn-outline-dark btn-sm rounded-pill px-4">Xem Tất Cả</a>
                        </header>
                        <Product products={newArrivals} />

                        <div className="my-5"></div>

                        {/* Section: Hot / Sale */}
                        <div className="card border-0 rounded-lg overflow-hidden mb-5 bg-light">
                            <div className="card-body p-4 p-lg-5">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h3 className="mb-2 text-danger font-weight-bold text-uppercase">
                                            <i className="fa fa-bolt mr-2"></i>Flash Sale
                                        </h3>
                                        <p className="text-muted">Cơ hội sở hữu giày hot với giá cực tốt. Số lượng có hạn!</p>
                                    </div>
                                    <div className="col-md-4 text-md-right mt-3 mt-md-0">
                                        <a href="/listing" className="btn btn-danger btn-lg rounded-pill px-5 shadow-sm">Mua Ngay</a>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <Product products={onSaleProducts} />
                            </div>
                        </div>

                        {/* Section: Suggested */}
                        <header className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                            <h4 className="font-weight-bold mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>Gợi Ý Cho Bạn</h4>
                            <a href="/listing" className="btn btn-outline-dark btn-sm rounded-pill px-4">Xem Thêm</a>
                        </header>
                        <Product products={suggestedProducts} />

                    </main>
                </div>
            </div>

            {/* Newsletter Section - Full Width Bottom */}
            <section className="py-5 border-top" style={{ backgroundColor: 'var(--bg-newsletter)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h3 className="font-weight-bold text-uppercase mb-3">Tham Gia Cùng Chúng Tôi</h3>
                            <p className="text-muted mb-4">Đăng ký để nhận thông tin mới nhất và ưu đãi độc quyền.</p>
                            <form className="form-inline justify-content-center">
                                <div className="input-group" style={{ maxWidth: '500px', width: '100%' }}>
                                    <input type="email" className="form-control border-0 py-4 pl-4 shadow-sm" placeholder="Email của bạn..." style={{ borderRadius: '50px 0 0 50px' }} />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary px-4 font-weight-bold" type="button" style={{ borderRadius: '0 50px 50px 0' }}>Đăng Ký</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;