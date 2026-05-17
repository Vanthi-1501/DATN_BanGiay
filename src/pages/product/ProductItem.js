import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ product }) => {
    const name = product.productName || product.name;
    const price = product.price;
    const specialPrice = product.specialPrice;
    const currentPrice = specialPrice || price;
    const originalPrice = specialPrice ? price : null;
    const discount = product.discount || (specialPrice && price ? Math.round(((price - specialPrice) / price) * 100) : 0);

    let imageStart = "https://placehold.co/150";
    if (product.image) {
        if (product.image.startsWith('http')) {
            imageStart = product.image;
        } else {
            imageStart = `http://localhost:8080/api/public/products/image/${product.image}`;
        }
    }

    return (
        <div className="col-xl-3 col-lg-4 col-md-4 col-6 mb-4">
            <div className="card h-100 border-0 bg-transparent product-card group">
                {/* Image Wrapper */}
                <div className="position-relative overflow-hidden rounded-lg bg-surface mb-3" style={{ paddingBottom: '120%', backgroundColor: '#f6f6f6' }}>
                    <Link to={`/product-detail/${product.productId || product.id}`} className="d-block w-100 h-100 position-absolute top-0 start-0">
                        <img
                            src={imageStart}
                            alt={name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            onError={(e) => { e.target.src = 'https://placehold.co/300x300/f0f0f0/666?text=No+Image'; }}
                        />
                    </Link>

                    {/* Badges */}
                    <div className="position-absolute top-0 start-0 p-3 w-100 d-flex justify-content-between align-items-start z-10">
                        {discount > 0 ? (
                            <span className="badge badge-danger rounded-sm">
                                -{discount}%
                            </span>
                        ) : <div></div>}
                    </div>


                </div>

                {/* Content */}
                <div className="card-body p-0 text-center text-md-left">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted text-uppercase font-weight-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                            {product.category ? product.category.categoryName : 'Giày'}
                        </small>
                    </div>

                    <h6 className="card-title mb-2">
                        <Link to={`/product-detail/${product.productId || product.id}`} className="text-dark font-weight-bold text-decoration-none text-truncate-2" style={{ lineHeight: '1.4' }}>
                            {name}
                        </Link>
                    </h6>

                    <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                        <span className="font-weight-bold text-dark" style={{ fontSize: '1rem' }}>
                            {currentPrice ? currentPrice.toLocaleString() : 0}đ
                        </span>
                        {originalPrice && (
                            <span className="text-muted text-decoration-line-through small">
                                {originalPrice.toLocaleString()}đ
                            </span>
                        )}
                    </div>
                    <div className="mt-3">
                        <Link to={`/product-detail/${product.productId || product.id}`} className="btn btn-dark btn-block rounded-pill w-100 py-2 font-weight-bold" style={{ fontSize: '0.85rem' }}>
                            Thêm vào giỏ
                        </Link>
                    </div>
                </div>
            </div>

            {/* Inline styles for hover effects specific to this component */}
            <style>{`
                .product-card:hover img {
                    transform: scale(1.05);
                }
                .product-card {
                    transition: all 0.3s ease;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    );
};

export default ProductItem;
