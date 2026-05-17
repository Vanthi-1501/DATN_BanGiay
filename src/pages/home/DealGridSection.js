import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/apiService';

const DealGrid = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                // Take first 6 products for the deal grid
                let productList = [];
                if (Array.isArray(data)) {
                    productList = data;
                } else if (data && Array.isArray(data.content)) {
                    productList = data.content;
                }

                if (productList.length > 0) {
                    setProducts(productList.slice(0, 6));
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching deals:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="padding-bottom">
            <header className="section-heading mb-4">
                <h3 className="title-section">Daily deals</h3>
            </header>

            <div className="row row-sm">
                {products.map((product) => {
                    let imageSrc = "https://placehold.co/150";
                    if (product.image) {
                        if (product.image.startsWith('http')) {
                            imageSrc = product.image;
                        } else {
                            imageSrc = `http://localhost:8080/api/public/products/image/${product.image}`;
                        }
                    }

                    return (
                        <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={product.productId || product.id}>
                            <div className="card card-sm card-product-grid">
                                <Link to={`/product-detail/${product.productId || product.id}`} className="img-wrap">
                                    {/* <b className="badge badge-danger mr-1">10% OFF</b> */}
                                    <img src={imageSrc} alt={product.productName} style={{ objectFit: 'cover' }} />
                                </Link>
                                <figcaption className="info-wrap">
                                    <Link to={`/product-detail/${product.productId || product.id}`} className="title">{product.productName}</Link>
                                    <div className="price-wrap">
                                        <span className="price">{product.specialPrice ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}đ</span>
                                        {/* <del className="price-old">$90</del> */}
                                    </div>
                                </figcaption>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default DealGrid;
