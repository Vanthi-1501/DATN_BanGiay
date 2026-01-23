import React from 'react';
import { Link } from 'react-router-dom';

const Slider = () => {
    return (
        <section className="position-relative overflow-hidden" style={{ minHeight: '600px', backgroundColor: '#000' }}>
            {/* Background elements or gradient */}
            <div className="position-absolute w-100 h-100" style={{
                background: 'radial-gradient(circle at 70% 50%, #2a2a2a 0%, #000 70%)',
                zIndex: 0
            }}></div>

            <div className="container position-relative h-100 d-flex align-items-center py-5" style={{ zIndex: 1 }}>
                <div className="row align-items-center w-100">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <span className="text-uppercase text-danger font-weight-bold letter-spacing-2 d-block mb-3" style={{ letterSpacing: '3px', fontSize: '14px' }}>
                            Bộ Sưu Tập Mới 2024
                        </span>
                        <h1 className="display-2 font-weight-bold text-white mb-4" style={{ lineHeight: 1.1, letterSpacing: '-1px' }}>
                            GIÀY FAKE LÕ <br />
                            <span className="text-outline-white" style={{ WebkitTextStroke: '1px #fff', color: 'transparent' }}>PHONG CÁCH ĐỈNH CAO</span>
                        </h1>
                        <p className="lead text-gray-400 mb-5 text-light" style={{ maxWidth: '480px', opacity: 0.8 }}>
                            Khám phá những mẫu giày sneaker hot nhất, thiết kế độc bản và công nghệ đệm êm ái cho mọi bước đi.
                        </p>
                        <div className="d-flex gap-3">
                            <Link to="/listing" className="btn btn-light rounded-pill px-5 py-3 font-weight-bold hover-lift">
                                Mua Ngay
                            </Link>
                            <Link to="/category" className="btn btn-outline-light rounded-pill px-5 py-3 hover-lift">
                                Xem Danh Mục
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?fit=crop&w=800&q=80"
                            alt="Hero Sneaker"
                            className="img-fluid drop-shadow-hover"
                            style={{
                                transform: 'rotate(-15deg) scale(1.1)',
                                filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))',
                                transition: 'transform 0.5s ease'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Slider;
