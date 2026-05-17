import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { GET_SEARCH_SUGGESTIONS } from '../services/apiService';

// Custom debounce to avoid dependency issues
function debounce(func, wait) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

const Header = () => {
	const { user, logout } = useAuth();
	const { cartCount } = useCart();
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	// Search State
	const [keyword, setKeyword] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	// Debounce suggestion fetch
	const fetchSuggestions = useCallback(debounce(async (text) => {
		if (!text.trim()) {
			setSuggestions([]);
			return;
		}
		try {
			const data = await GET_SEARCH_SUGGESTIONS(text);
			if (Array.isArray(data)) {
				setSuggestions(data);
			}
		} catch (error) {
			console.error(error);
		}
	}, 300), []);

	const handleSearchChange = (e) => {
		const text = e.target.value;
		setKeyword(text);
		fetchSuggestions(text);
	};

	// Handle scroll effect for sticky header opacity/shadow
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Active link helper
	const isActive = (path) => location.pathname === path ? 'text-danger fw-bold' : 'text-dark opacity-75';

	return (
		<header
			className={`fixed-top bg-white ${scrolled ? 'shadow-sm' : 'border-bottom'}`}
			style={{ transition: 'all 0.4s ease', zIndex: 1030, padding: scrolled ? '5px 0' : '12px 0' }}
		>
			<div className="container" style={{ maxWidth: '1400px' }}>
				<div className="d-flex align-items-center justify-content-between">

					{/* Left: Branding & Main Nav */}
					<div className="d-flex align-items-center gap-5">
						<Link to="/" className="text-decoration-none">
							<span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-1.5px', color: 'black' }}>
								thivan<span style={{ color: 'red' }}>.</span>
							</span>
						</Link>

						{/* Desktop Menu */}
						<nav className="d-none d-lg-flex gap-5">
							<Link to="/" className={`text-uppercase small-link transition-all ${isActive('/')}`} style={{ fontSize: '13px', letterSpacing: '1px' }}>Trang chủ</Link>
							<Link to="/listing" className={`text-uppercase small-link transition-all ${isActive('/listing')}`} style={{ fontSize: '13px', letterSpacing: '1px' }}>Hàng mới về</Link>
							<Link to="/category" className={`text-uppercase small-link transition-all ${isActive('/category')}`} style={{ fontSize: '13px', letterSpacing: '1px' }}>Danh mục</Link>
						</nav>
					</div>

					{/* Center: Search (Premium Style) */}
					<div className="d-none d-md-block flex-grow-1 mx-5" style={{ maxWidth: '500px' }}>
						<div className="position-relative">
							<form onSubmit={(e) => {
								e.preventDefault();
								if (keyword.trim()) {
									navigate(`/listing?keyword=${encodeURIComponent(keyword.trim())}`);
									setSuggestions([]);
								}
							}}>
								<input
									type="text"
									className="form-control rounded-pill border-0 shadow-sm"
									placeholder="Tìm kiếm phong cách của bạn..."
									style={{ paddingLeft: '45px', height: '46px', backgroundColor: '#f8f9fa', fontSize: '14px' }}
									value={keyword}
									onChange={handleSearchChange}
								/>
								<i className="fa fa-search position-absolute text-muted" style={{ left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}></i>
							</form>

							{/* Suggestions Dropdown */}
							{suggestions.length > 0 && (
								<div className="position-absolute w-100 bg-white shadow-lg rounded-lg mt-2 overflow-hidden" style={{ zIndex: 1050, borderRadius: '15px' }}>
									<ul className="list-group list-group-flush">
										{suggestions.map((item, index) => (
											<li
												key={index}
												className="list-group-item list-group-item-action border-0 px-4 py-2 cursor-pointer"
												style={{ cursor: 'pointer' }}
												onClick={() => {
													setKeyword(item);
													setSuggestions([]);
													navigate(`/listing?keyword=${encodeURIComponent(item)}`);
												}}
											>
												<i className="fa fa-search text-muted mr-3" style={{ fontSize: '12px' }}></i>
												{item}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>

					{/* Right: Icons & Actions */}
					<div className="d-flex align-items-center gap-4">
						{user ? (
							<div className="dropdown">
								<a href="#!" className="d-flex align-items-center text-dark text-decoration-none dropdown-toggle no-caret" data-toggle="dropdown">
									<div className="bg-light rounded-circle d-flex align-items-center justify-content-center hover-lift" style={{ width: '42px', height: '42px' }}>
										<i className="fa fa-user" style={{ fontSize: '18px' }}></i>
									</div>
								</a>
								<div className="dropdown-menu dropdown-menu-right shadow-lg border-0 mt-3 p-3" style={{ borderRadius: '15px' }}>
									<div className="px-3 py-2">
										<p className="mb-0 small text-muted">Xin chào,</p>
										<h6 className="mb-0 font-weight-bold">{user.firstName || user.fullName || "User"}</h6>
									</div>
									<div className="dropdown-divider my-2"></div>
									<Link className="dropdown-item rounded-pill py-2" to="/profile">Hồ sơ cá nhân</Link>
									<Link className="dropdown-item rounded-pill py-2 text-danger" to="#!" onClick={(e) => { e.preventDefault(); logout(); }}>Đăng xuất</Link>
								</div>
							</div>
						) : (
							<Link to="/login" className="btn btn-sm btn-dark rounded-pill px-4 font-weight-bold" style={{ height: '40px' }}>Đăng nhập</Link>
						)}

						<Link to="/cart" className="position-relative text-dark hover-lift">
							<i className="fa fa-shopping-bag" style={{ fontSize: '22px' }}></i>
							{cartCount > 0 && (
								<span className="position-absolute translate-middle badge rounded-circle bg-danger border-2 border-white"
									style={{
										top: '2px',
										left: '100%',
										width: '22px',
										height: '22px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '11px',
										fontWeight: 'bold',
										boxShadow: '0 2px 5px rgba(255,0,0,0.3)'
									}}>
									{cartCount}
								</span>
							)}
						</Link>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
