import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../../services/apiService';

const ListingGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts({ pageSize: 50 });
                let productList = [];
                if (Array.isArray(data)) {
                    productList = data;
                } else if (data && Array.isArray(data.content)) {
                    productList = data.content;
                }
                setProducts(productList);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="section-content padding-y">
            <div className="container">

                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2"> Bạn đang xem: </div>
                            <nav className="col-md-8">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Sản phẩm</li>
                                </ol>
                            </nav>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-2">Lọc theo</div>
                            <div className="col-md-10">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <a href="#!" className="dropdown-toggle" data-toggle="dropdown" onClick={(e) => e.preventDefault()}>   Nhà cung cấp </a>
                                            <div className="dropdown-menu">
                                                <a href="#!" className="dropdown-item" onClick={(e) => e.preventDefault()}>Tùy chọn 1</a>
                                                <a href="#!" className="dropdown-item" onClick={(e) => e.preventDefault()}>Tùy chọn 2</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="dropdown">
                                            <a href="#!" className="dropdown-toggle" data-toggle="dropdown" onClick={(e) => e.preventDefault()}>Tính năng</a>
                                            <div className="dropdown-menu">
                                                <a href="#!" className="dropdown-item" onClick={(e) => e.preventDefault()}>Tùy chọn 1</a>
                                                <a href="#!" className="dropdown-item" onClick={(e) => e.preventDefault()}>Tùy chọn 2</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <header className="mb-3">
                    <div className="form-inline">
                        <strong className="mr-md-auto">Tìm thấy {products.length} sản phẩm </strong>
                        <select className="mr-2 form-control">
                            <option>Mới nhất</option>
                            <option>Xu hướng</option>
                            <option>Phổ biến nhất</option>
                            <option>Rẻ nhất</option>
                        </select>
                        <div className="btn-group">
                            <Link to="/listing" className="btn btn-light" data-toggle="tooltip" title="Xem danh sách">
                                <i className="fa fa-bars"></i>
                            </Link>
                            <Link to="/listing-grid" className="btn btn-light active" data-toggle="tooltip" title="Xem lưới">
                                <i className="fa fa-th"></i>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="row">
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
                                <div className="col-md-3" key={product.productId || product.id}>
                                    <figure className="card card-product-grid">
                                        <div className="img-wrap">
                                            {/* {index === 0 && <span className="badge badge-danger"> NEW </span>} */}
                                            <img src={imageSrc} alt={product.productName} style={{ objectFit: 'cover' }} />
                                        </div>
                                        <figcaption className="info-wrap">
                                            <Link to={`/product-detail/${product.productId || product.id}`} className="title mb-2">{product.productName}</Link>
                                            <div className="price-wrap">
                                                <span className="price">{product.specialPrice ? product.specialPrice.toLocaleString() : product.price.toLocaleString()}đ</span>
                                                {/* <small className="text-muted">/per item</small> */}
                                            </div>
                                            <p className="mb-2"> {product.quantity} Pieces <small className="text-muted">(In Stock)</small></p>

                                            <hr />

                                            <Link to={`/product-detail/${product.productId || product.id}`} className="btn btn-primary btn-block"> Details </Link>
                                        </figcaption>
                                    </figure>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center mt-5">
                            <p>No products found.</p>
                        </div>
                    )}
                </div>

                <nav className="mb-4" aria-label="Page navigation sample">
                    <ul className="pagination">
                        <li className="page-item disabled"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>Previous</Link></li>
                        <li className="page-item active"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>1</Link></li>
                        <li className="page-item"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>2</Link></li>
                        <li className="page-item"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>3</Link></li>
                        <li className="page-item"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>4</Link></li>
                        <li className="page-item"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>5</Link></li>
                        <li className="page-item"><Link className="page-link" to="#!" onClick={(e) => e.preventDefault()}>Next</Link></li>
                    </ul>
                </nav>

                <div className="box text-center">
                    <p>Did you find what you were looking for?</p>
                    <Link to="#" className="btn btn-light">Yes</Link>
                    <Link to="#" className="btn btn-light">No</Link>
                </div>

            </div>
        </section>
    );
};

export default ListingGrid;
