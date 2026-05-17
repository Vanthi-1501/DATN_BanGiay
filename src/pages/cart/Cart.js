import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const handleRemove = (productId, size) => {
        removeFromCart(productId, size);
    };

    const handleUpdateQuantity = (productId, size, currentQuantity, delta) => {
        updateQuantity(productId, size, currentQuantity + delta);
    };

    if (cartItems.length === 0) {
        return (
            <section className="section-content min-vh-100 d-flex align-items-center justify-content-center bg-white">
                <div className="container text-center">
                    <div className="mb-4">
                        <i className="fa fa-shopping-bag text-muted" style={{ fontSize: '4rem', opacity: 0.1 }}></i>
                    </div>
                    <h3 className="mb-3 font-weight-bold text-uppercase" style={{ letterSpacing: '1px' }}>Giỏ Hàng Của Bạn Đang Trống</h3>
                    <p className="text-muted mb-4">Có vẻ như bạn chưa chọn được món đồ ưng ý nào.</p>
                    <Link to="/" className="btn btn-dark btn-lg px-5 rounded-0">Bắt Đầu Mua Sắm</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section-content padding-y bg-white" style={{ minHeight: '90vh' }}>
            <div className="container">
                <div className="row">
                    <main className="col-lg-8">
                        <div className="card border-0 mb-4">
                            <div className="card-body p-0">
                                <h4 className="card-title mb-4 font-weight-bold text-uppercase" style={{ letterSpacing: '1px' }}>Giỏ Hàng ({cartItems.length})</h4>

                                {cartItems.map((item, index) => {
                                    let imageUrl = "https://placehold.co/150/f0f0f0/666?text=No+Image";
                                    if (item.image) {
                                        if (item.image.startsWith('http')) {
                                            imageUrl = item.image;
                                        } else {
                                            imageUrl = `${process.env.REACT_APP_API_BASE_URL}/api/public/products/image/${item.image}`;
                                        }
                                    }

                                    return (
                                        <div key={`${item.productId}-${item.size}-${index}`} className="row mb-4 pb-4 border-bottom align-items-center">
                                            <div className="col-md-3 col-4">
                                                <div className="img-wrap bg-light d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
                                                    <img src={imageUrl} className="img-fluid" style={{ maxHeight: '100%', mixBlendMode: 'multiply' }} alt={item.name}
                                                        onError={(e) => { e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; e.target.onerror = null; }} />
                                                </div>
                                            </div>
                                            <div className="col-md-5 col-8">
                                                <Link to={`/product-detail/${item.productId}`} className="text-dark font-weight-bold h5 d-block mb-1 text-decoration-none">{item.name}</Link>
                                                <small className="text-muted d-block mb-2">Size: {item.size}</small>
                                                <div className="input-group input-group-sm mb-1" style={{ width: '100px' }}>
                                                    <div className="input-group-prepend">
                                                        <button className="btn btn-outline-secondary border-0 bg-light" type="button" style={{ borderRadius: '4px 0 0 4px' }} onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity, -1)}>
                                                            <i className="fa fa-minus"></i>
                                                        </button>
                                                    </div>
                                                    <input type="text" className="form-control text-center border-0 bg-light font-weight-bold" style={{ cursor: 'default' }} value={item.quantity} readOnly />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-secondary border-0 bg-light" type="button" style={{ borderRadius: '0 4px 4px 0' }} onClick={() => handleUpdateQuantity(item.productId, item.size, item.quantity, 1)}>
                                                            <i className="fa fa-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-12 mt-3 mt-md-0 d-flex flex-row flex-md-column align-items-center align-items-md-end justify-content-between">
                                                <var className="price h6 mb-2 font-weight-bold">{(item.price * item.quantity).toLocaleString()}₫</var>
                                                <button className="btn btn-sm text-muted text-decoration-underline p-0" onClick={() => handleRemove(item.productId, item.size)}>
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Link to="/" className="btn btn-outline-dark rounded-0 px-4"> <i className="fa fa-arrow-left mr-2"></i> Tiếp Tục Mua Sắm </Link>
                                    <button className="btn btn-light text-muted rounded-0" onClick={clearCart}>Xóa Giỏ Hàng</button>
                                </div>
                            </div>
                        </div>
                    </main>

                    <aside className="col-md-4 mt-4 mt-lg-0">
                        <div className="card border-0 bg-light">
                            <div className="card-body p-4">
                                <h5 className="card-title mb-4 font-weight-bold text-uppercase">Tóm Tắt Đơn Hàng</h5>
                                <dl className="dlist-align mb-2">
                                    <dt className="text-muted">Tạm Tính</dt>
                                    <dd className="text-right">{cartTotal.toLocaleString()}₫</dd>
                                </dl>
                                <dl className="dlist-align mb-2">
                                    <dt className="text-muted">Vận Chuyển</dt>
                                    <dd className="text-right text-muted">Miễn phí</dd>
                                </dl>
                                <dl className="dlist-align mb-2">
                                    <dt className="text-muted">Giảm Giá</dt>
                                    <dd className="text-right text-success">-0₫</dd>
                                </dl>
                                <hr />
                                <dl className="dlist-align mb-4">
                                    <dt className="h5 font-weight-bold">Tổng Cộng</dt>
                                    <dd className="text-right h5 font-weight-bold">{cartTotal.toLocaleString()}₫</dd>
                                </dl>

                                <Link to="/checkout" className="btn btn-dark btn-block btn-lg rounded-0 py-3">
                                    Thanh Toán Ngay
                                </Link>

                                <div className="mt-4">
                                    <p className="small text-muted mb-2">Thanh Toán An Toàn</p>
                                    <img src={require("../../assets/images/misc/payments.png")} height="20" alt="payments" style={{ opacity: 0.5, filter: 'grayscale(100%)' }} />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default Cart;
