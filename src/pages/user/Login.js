import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LOGIN } from '../../services/apiService';
import { useSignIn, useUser } from '@clerk/clerk-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { isSignedIn } = useUser();

    // Auto-redirect if already logged in (Global sync handles the state)
    useEffect(() => {
        if (isSignedIn) {
            navigate("/");
        }
    }, [isSignedIn, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const body = { email, password };
            const response = await LOGIN(body);

            if (response && response.token) {
                const userInfo = {
                    id: response.id,
                    email: response.email,
                    fullName: response.fullName,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    mobileNumber: response.mobileNumber,
                    address: response.addressLine || '',
                    city: response.city || '',
                    country: response.country || 'Vietnam'
                };

                login(response.token, userInfo);

                alert("Đăng nhập thành công!");
                navigate("/");
            } else {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        }
    };

    const { signIn, isLoaded } = useSignIn();

    const handleGoogleLogin = async () => {
        console.log("Google Login Clicked. Clerk Loaded:", isLoaded);
        if (!isLoaded) {
            setError("Hệ thống đăng nhập chưa sẵn sàng. Vui lòng thử lại hoặc kiểm tra kết nối mạng.");
            return;
        }
        try {
            console.log("Initiating redirect...");
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/"
            });
        } catch (err) {
            console.error("Google Login Error:", err);
            // If already signed in, just redirect to home
            if (err.errors && err.errors.find(e => e.code === "session_exists")) {
                navigate("/");
                return;
            }
            // Fallback text check
            if (err.message && err.message.includes("already signed in")) {
                navigate("/");
                return;
            }
            setError("Lỗi đăng nhập Google: " + err.message);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: "84vh", background: "var(--bg-body)" }}>
            <div className="card mx-auto shadow-sm border-0" style={{ maxWidth: 380, marginTop: 100, borderRadius: "var(--radius-lg)" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center font-weight-bold">Đăng nhập</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                name="username"
                                className="form-control border-0 bg-light"
                                placeholder="Email"
                                type="email"
                                style={{ height: '45px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                name="password"
                                className="form-control border-0 bg-light"
                                placeholder="Mật khẩu"
                                type="password"
                                style={{ height: '45px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group d-flex justify-content-between align-items-center">
                            <label className="custom-control custom-checkbox mb-0">
                                <input type="checkbox" className="custom-control-input" defaultChecked />
                                <div className="custom-control-label text-muted"> Ghi nhớ </div>
                            </label>
                            <Link to="/forgot-password" className="text-primary small">Quên mật khẩu?</Link>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block shadow-sm" style={{ height: '45px', borderRadius: 'var(--radius-md)' }}> Đăng nhập  </button>
                        </div>
                    </form>

                    <div className="text-center mb-3">
                        <span className="text-muted">hoặc</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-google btn-block shadow-sm border"
                        style={{ height: '45px', borderRadius: 'var(--radius-md)', backgroundColor: '#fff' }}
                        onClick={handleGoogleLogin}
                    >
                        <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
                        Đăng nhập bằng Google
                    </button>
                </div>
            </div >
            <p className="text-center mt-4 text-muted">Chưa có tài khoản? <Link to="/register" className="text-primary font-weight-bold">Đăng ký ngay</Link></p>
            <br /><br />
        </section >
    );
};

export default Login;
