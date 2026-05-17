import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SliderSection.css';

const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        {
            image: require("../../assets/images/banners/banner1.jpg"),
            title: "Bộ Sưu Tập Mới 2026",
            description: "Khám phá những xu hướng thời trang mới nhất với các sản phẩm chất lượng cao và giá cả hợp lý",
            buttonText: "Khám Phá Ngay"
        },
        {
            image: require("../../assets/images/banners/banner2.jpg"),
            title: "Giảm Giá Đến 50%",
            description: "Cơ hội tuyệt vời để sở hữu những sản phẩm yêu thích với mức giá không thể tốt hơn",
            buttonText: "Mua Ngay"
        },
        {
            image: require("../../assets/images/banners/banner3.jpg"),
            title: "Phong Cách Thể Thao",
            description: "Năng động và thoải mái với bộ sưu tập thể thao cao cấp dành cho mọi hoạt động",
            buttonText: "Xem Thêm"
        },
        {
            image: require("../../assets/images/banners/banner4.jpg"),
            title: "Thời Trang Công Sở",
            description: "Lịch lãm và chuyên nghiệp với các trang phục công sở sang trọng và tinh tế",
            buttonText: "Khám Phá"
        },
        {
            image: require("../../assets/images/banners/banner5.jpg"),
            title: "Phụ Kiện Thời Trang",
            description: "Hoàn thiện phong cách của bạn với các phụ kiện độc đáo và ấn tượng",
            buttonText: "Mua Sắm"
        },
        {
            image: require("../../assets/images/banners/banner6.jpg"),
            title: "Bộ Sưu Tập Mùa Hè",
            description: "Tươi mới và năng động với những thiết kế mùa hè đầy màu sắc và sống động",
            buttonText: "Xem Ngay"
        },
        {
            image: require("../../assets/images/banners/banner7.jpg"),
            title: "Thời Trang Cao Cấp",
            description: "Đẳng cấp và sang trọng với các sản phẩm thời trang cao cấp từ thương hiệu uy tín",
            buttonText: "Khám Phá"
        },
        {
            image: require("../../assets/images/banners/banner8.jpg"),
            title: "Ưu Đãi Đặc Biệt",
            description: "Nhận ngay các ưu đãi độc quyền và quà tặng hấp dẫn khi mua sắm hôm nay",
            buttonText: "Nhận Ưu Đãi"
        },
        {
            image: require("../../assets/images/banners/banner9.jpg"),
            title: "Xu Hướng Mới Nhất",
            description: "Cập nhật ngay những xu hướng thời trang hot nhất đang được giới trẻ yêu thích",
            buttonText: "Cập Nhật"
        }
    ];

    // Tự động chuyển slide mỗi 5 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="slider-carousel-section">
            <div className="slider-carousel-container">
                <div className="slider-carousel">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="slider-image-wrapper">
                                <img src={banner.image} className="slider-image" alt={banner.title} />
                                <div className="slider-overlay"></div>
                            </div>
                            <div className="slider-content-wrapper">
                                <div className="container">
                                    <div className="slider-content">
                                        <span className="slider-badge">Bộ Sưu Tập Mới 2026</span>
                                        <h1 className="slider-title">{banner.title}</h1>
                                        <p className="slider-description">{banner.description}</p>
                                        <div className="slider-buttons">
                                            <Link to="/listing" className="btn btn-light btn-lg rounded-pill px-5 py-3 font-weight-bold">
                                                {banner.buttonText}
                                            </Link>
                                            <Link to="/category" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3">
                                                Xem Danh Mục
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút điều hướng */}
                <button className="slider-control prev" onClick={prevSlide} aria-label="Previous slide">
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button className="slider-control next" onClick={nextSlide} aria-label="Next slide">
                    <i className="fa fa-chevron-right"></i>
                </button>

                {/* Chỉ báo slide */}
                <div className="slider-indicators">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Slider;

