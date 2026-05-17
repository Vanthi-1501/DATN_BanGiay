import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { VERIFY_RESET_CODE } from '../../services/apiService';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        } else {
            // If no email passed, redirect back to forgot password or ask user to re-enter
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await VERIFY_RESET_CODE(email, code);
            // Response contains { resetSession: '...' }
            if (response && response.resetSession) {
                navigate('/reset-password', { state: { resetSession: response.resetSession } });
            } else {
                setError("Mã OTP không hợp lệ.");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Mã OTP không hợp lệ hoặc đã hết hạn.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh", background: "var(--bg-body)" }}>
            <div className="card mx-auto shadow-sm border-0" style={{ maxWidth: 380, marginTop: 100, borderRadius: "var(--radius-lg)" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center font-weight-bold">Xác thực OTP</h4>
                    <p className="text-center text-muted">Mã OTP đã được gửi đến {email}</p>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control border-0 bg-light text-center"
                                placeholder="Nhập mã 6 số"
                                type="text"
                                style={{ height: '45px', letterSpacing: '5px', fontSize: '1.2rem' }}
                                maxLength="6"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block shadow-sm" disabled={loading} style={{ height: '45px', borderRadius: 'var(--radius-md)' }}>
                                {loading ? 'Đang xác thực...' : 'Xác thực'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-muted"><Link to="/login" className="text-primary font-weight-bold">Huỷ</Link></p>
                </div>
            </div>
        </section>
    );
};

export default VerifyCode;
