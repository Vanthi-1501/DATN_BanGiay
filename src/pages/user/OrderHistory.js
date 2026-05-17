import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrdersByEmail } from '../../services/apiService';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (user && token) {
            fetchOrders();
        } else if (!loading) {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("⚠️ No auth token found, skipping fetchOrders");
                return;
            }

            console.log("🔍 Fetching orders for user:", user);
            console.log("📧 Email:", user.email);

            // Use email instead of user.id to support both Google login and regular login
            const data = await getOrdersByEmail(user.email);

            console.log("📦 Orders received:", data);
            console.log("📊 Number of orders:", data?.length || 0);

            setOrders(data);
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            console.error("Error details:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container padding-y">
                <div className="text-center" style={{ paddingTop: '100px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="section-content padding-y" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row">
                    {/* Sidebar */}
                    <aside className="col-md-3 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-0">
                                <nav className="list-group list-group-flush">
                                    <Link
                                        className="list-group-item list-group-item-action border-0 d-flex align-items-center"
                                        to="/profile"
                                        style={{ padding: '15px 20px', fontWeight: '500' }}
                                    >
                                        <i className="fa fa-user mr-3"></i>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link
                                        className="list-group-item list-group-item-action active border-0 d-flex align-items-center"
                                        to="/profile-orders"
                                        style={{ padding: '15px 20px', fontWeight: '500' }}
                                    >
                                        <i className="fa fa-shopping-bag mr-3"></i>
                                        Đơn hàng
                                    </Link>
                                    <Link
                                        className="list-group-item list-group-item-action border-0 d-flex align-items-center"
                                        to="/listing"
                                        style={{ padding: '15px 20px', fontWeight: '500' }}
                                    >
                                        <i className="fa fa-shopping-cart mr-3"></i>
                                        Danh sách yêu thích
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="col-md-9">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 py-4">
                                <h4 className="mb-0 font-weight-bold">Lịch Sử Đơn Hàng</h4>
                                <small className="text-muted">Quản lý và theo dõi đơn hàng của bạn</small>
                            </div>
                            <div className="card-body p-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fa fa-shopping-bag" style={{ fontSize: '64px', color: '#ddd' }}></i>
                                        <p className="text-muted mt-3 mb-4">Bạn chưa có đơn hàng nào.</p>
                                        <Link to="/listing" className="btn btn-primary">
                                            <i className="fa fa-shopping-cart mr-2"></i>
                                            Bắt đầu mua sắm
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th style={{ padding: '15px', fontWeight: '600' }}>Mã đơn</th>
                                                    <th style={{ padding: '15px', fontWeight: '600' }}>Ngày đặt</th>
                                                    <th style={{ padding: '15px', fontWeight: '600' }}>Tổng tiền</th>
                                                    <th style={{ padding: '15px', fontWeight: '600' }}>Trạng thái</th>
                                                    <th style={{ padding: '15px', fontWeight: '600' }}>Chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map(order => (
                                                    <tr key={order.orderId}>
                                                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                                            <strong>#{order.orderId}</strong>
                                                        </td>
                                                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                                            {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                                                        </td>
                                                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                                            <strong className="text-primary">
                                                                {order.totalAmount?.toLocaleString()} ₫
                                                            </strong>
                                                        </td>
                                                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                                            <span
                                                                className={`badge badge-pill ${order.orderStatus === 'PAID' ? 'badge-success' :
                                                                    order.orderStatus === 'Order Placed' ? 'badge-info' :
                                                                        order.orderStatus === 'CANCELLED' ? 'badge-danger' :
                                                                            'badge-warning'
                                                                    }`}
                                                                style={{ padding: '8px 16px', fontSize: '12px' }}
                                                            >
                                                                {order.orderStatus || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                                                            <Link
                                                                to={`/order-detail/${order.orderId}`}
                                                                className="btn btn-sm btn-outline-primary"
                                                                style={{ padding: '6px 20px' }}
                                                            >
                                                                Xem
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};

export default OrderHistory;
