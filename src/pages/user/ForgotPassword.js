import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FORGOT_PASSWORD } from '../../services/apiService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await FORGOT_PASSWORD(email);
            // Backend returns success message. We don't expose if user exists, but we proceed to verify step for UX
            // Or typically we tell them "Check your email".
            // Here, to follow the flow: input email -> get OTP -> input OTP.
            // So we navigate to VerifyCode immediately, passing email.
            setMessage("Nếu email tồn tại, mã OTP đã được gửi. Vui lòng kiểm tra email.");
            setTimeout(() => {
                navigate('/verify-code', { state: { email } });
            }, 2000); // Wait 2s to show message
        } catch (err) {
            // Even on error (like rate limit), display message
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh", background: "var(--bg-body)" }}>
            <div className="card mx-auto shadow-sm border-0" style={{ maxWidth: 380, marginTop: 100, borderRadius: "var(--radius-lg)" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center font-weight-bold">Quên mật khẩu</h4>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control border-0 bg-light"
                                placeholder="Nhập email của bạn"
                                type="email"
                                style={{ height: '45px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block shadow-sm" disabled={loading} style={{ height: '45px', borderRadius: 'var(--radius-md)' }}>
                                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-muted"><Link to="/login" className="text-primary font-weight-bold">Quay lại đăng nhập</Link></p>
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
