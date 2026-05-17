import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { RESET_PASSWORD } from '../../services/apiService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [resetSession, setResetSession] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (location.state && location.state.resetSession) {
            setResetSession(location.state.resetSession);
        } else {
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu không khớp.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await RESET_PASSWORD(resetSession, newPassword);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Có lỗi xảy ra. Phiên làm việc có thể đã hết hạn.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section className="section-content padding-y" style={{ minHeight: "84vh", background: "var(--bg-body)" }}>
                <div className="card mx-auto shadow-sm border-0" style={{ maxWidth: 380, marginTop: 100, borderRadius: "var(--radius-lg)" }}>
                    <div className="card-body text-center">
                        <h4 className="card-title mb-4 text-success font-weight-bold">Thành công!</h4>
                        <p>Mật khẩu của bạn đã được thay đổi.</p>
                        <p>Đang chuyển hướng về trang đăng nhập...</p>
                        <Link to="/login" className="btn btn-primary mt-3">Đăng nhập ngay</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh", background: "var(--bg-body)" }}>
            <div className="card mx-auto shadow-sm border-0" style={{ maxWidth: 380, marginTop: 100, borderRadius: "var(--radius-lg)" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center font-weight-bold">Đặt lại mật khẩu</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control border-0 bg-light"
                                placeholder="Mật khẩu mới"
                                type="password"
                                style={{ height: '45px' }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                className="form-control border-0 bg-light"
                                placeholder="Nhập lại mật khẩu"
                                type="password"
                                style={{ height: '45px' }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block shadow-sm" disabled={loading} style={{ height: '45px', borderRadius: 'var(--radius-md)' }}>
                                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
