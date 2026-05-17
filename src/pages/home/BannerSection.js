import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BannerSection.css';

const Banner = () => {
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
        <section className="banner-carousel-section padding-bottom">
            <div className="banner-carousel-container">
                <div className="banner-carousel">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
                        >
                            <div className="card card-banner-lg bg-dark">
                                <img src={banner.image} className="card-img opacity" alt={banner.title} />
                                <div className="card-img-overlay text-white">
                                    <div className="banner-content">
                                        <h2 className="card-title animate-title">{banner.title}</h2>
                                        <p className="card-text animate-text">{banner.description}</p>
                                        <Link to="/products" className="btn btn-light btn-lg animate-button">
                                            {banner.buttonText}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút điều hướng */}
                <button className="carousel-control prev" onClick={prevSlide}>
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button className="carousel-control next" onClick={nextSlide}>
                    <i className="fa fa-chevron-right"></i>
                </button>

                {/* Chỉ báo slide */}
                <div className="carousel-indicators">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Banner;
