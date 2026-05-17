import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GET_ID } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const OrderDetail = () => {
    const { orderId } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            const data = await GET_ID("/orders", orderId);
            setOrder(data);
        } catch (error) {
            console.error("❌ Error fetching order detail:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container padding-y" style={{ paddingTop: '100px' }}>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container padding-y" style={{ paddingTop: '100px' }}>
                <div className="alert alert-danger">Không tìm thấy thông tin đơn hàng.</div>
                <Link to="/profile-orders" className="btn btn-primary">Quay lại danh sách</Link>
            </div>
        );
    }

    return (
        <section className="section-content padding-y bg-light" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="mb-0 font-weight-bold">Chi Tiết Đơn Hàng #{order.orderId}</h4>
                            <small className="text-muted">Ngày đặt: {new Date(order.orderDate).toLocaleDateString("vi-VN")}</small>
                        </div>
                        <span className={`badge badge-pill ${order.orderStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`} style={{ padding: '8px 20px' }}>
                            {order.orderStatus}
                        </span>
                    </div>
                    <div className="card-body p-4">
                        <h6 className="font-weight-bold mb-3">Sản phẩm đã đặt</h6>
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-right">Đơn giá</th>
                                        <th className="text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems?.map((item, idx) => (
                                        <tr key={idx} className="border-bottom">
                                            <td style={{ verticalAlign: 'middle' }}>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={item.product?.imageName && item.product.imageName.startsWith('http') ? item.product.imageName : `http://localhost:8080/api/public/products/image/${item.product?.imageName}`}
                                                        alt=""
                                                        style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '15px' }}
                                                    />
                                                    <span>{item.product?.productName}</span>
                                                </div>
                                            </td>
                                            <td className="text-center" style={{ verticalAlign: 'middle' }}>{item.quantity}</td>
                                            <td className="text-right" style={{ verticalAlign: 'middle' }}>{item.orderedProductPrice?.toLocaleString()}₫</td>
                                            <td className="text-right" style={{ verticalAlign: 'middle' }}>{(item.orderedProductPrice * item.quantity).toLocaleString()}₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <h6 className="font-weight-bold mb-2">Thông tin giao hàng</h6>
                                <p className="mb-1"><strong>Người nhận:</strong> {order.name || user?.fullName}</p>
                                <p className="mb-1"><strong>SĐT:</strong> {order.phoneNumber || user?.mobileNumber}</p>
                                <p className="mb-1"><strong>Địa chỉ:</strong> {order.address}</p>
                            </div>
                            <div className="col-md-6 text-right">
                                <h6 className="font-weight-bold mb-2">Tóm tắt thanh toán</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{order.totalAmount?.toLocaleString()}₫</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Phí vận chuyển:</span>
                                    <span>0₫</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <span className="h5 font-weight-bold">Tổng cộng:</span>
                                    <span className="h5 font-weight-bold text-primary">{order.totalAmount?.toLocaleString()}₫</span>
                                </div>
                                <p className="text-muted small">Phương thức: {order.payment?.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer bg-white border-0 py-4 text-center">
                        <Link to="/profile-orders" className="btn btn-outline-dark px-5">
                            <i className="fa fa-chevron-left mr-2"></i> Quay lại danh sách
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetail;
