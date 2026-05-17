import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
// import { updateProfile } from '../../services/apiService'; // Assuming this exists or using a generic PUT

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        address: '',
        city: '',
        country: 'Vietnam'
    });

    // Address State
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
    const [selectedWardCode, setSelectedWardCode] = useState("");

    const [selectedProvinceName, setSelectedProvinceName] = useState("");
    const [selectedDistrictName, setSelectedDistrictName] = useState("");
    const [selectedWardName, setSelectedWardName] = useState("");
    const [specificAddress, setSpecificAddress] = useState("");

    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userId = user?.id || user?.userId;

        // If logged in via Google (Clerk), use context data only, skip backend fetch
        if (user?.loginType === "GOOGLE") {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                mobileNumber: user.mobileNumber || '',
                address: user.address || '',
                city: user.city || '',
                country: user.country || 'Vietnam'
            });
            // Google avatar is handled by Clerk usually, but for now specific flow:
            // setAvatar(user.imageUrl); // If we mapped it.
            return;
        }

        if (userId) {
            // Fetch fresh data from API
            fetch(`http://127.0.0.1:8080/api/public/users/${userId}`)
                .then(res => res.json())
                .then(data => {
                    console.log("Fetched User Data:", data);
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        mobileNumber: data.mobileNumber || '',
                        address: data.addressLine || (data.address && data.address.street) || '',
                        city: data.city || (data.address && data.address.city) || '',
                        country: data.country || (data.address && data.address.country) || 'Vietnam'
                    });
                    setAvatar(data.image);
                })
                .catch(err => console.error("Failed to fetch user profile:", err));
        }
    }, [user]);

    // Fetch Provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get("https://provinces.open-api.vn/api/?depth=1");
                setProvinces(response.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Address Changes
    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        const province = provinces.find(p => p.code == code);

        setSelectedProvinceCode(code);
        setSelectedProvinceName(province ? province.name : "");
        setSelectedDistrictCode("");
        setSelectedWardCode("");
        setDistricts([]);
        setWards([]);

        if (code) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
                setDistricts(response.data.districts);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        const district = districts.find(d => d.code == code);

        setSelectedDistrictCode(code);
        setSelectedDistrictName(district ? district.name : "");
        setSelectedWardCode("");
        setWards([]);

        if (code) {
            try {
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
                setWards(response.data.wards);
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        }
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        const ward = wards.find(w => w.code == code);
        setSelectedWardCode(code);
        setSelectedWardName(ward ? ward.name : "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalAddressLine = formData.address || "";
            let finalCity = formData.city || "";

            // If user selected new address components
            if (selectedProvinceName && selectedDistrictName && selectedWardName) {
                finalAddressLine = `${specificAddress}, ${selectedWardName}, ${selectedDistrictName}`;
                finalCity = selectedProvinceName;
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                city: finalCity,
                addressLine: finalAddressLine,
                country: formData.country
            };

            const userId = user.id || user.userId;

            // FIX: If Google User, do not call Backend (incompatible ID type). 
            // Update local state only.
            if (user.loginType === "GOOGLE") {
                // Simulate network delay
                await new Promise(r => setTimeout(r, 500));

                const updatedUser = {
                    ...user,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    mobileNumber: payload.mobileNumber,
                    city: finalCity,
                    addressLine: finalAddressLine, // Map to addressLine or address object as needed
                    address: finalAddressLine,
                    country: payload.country
                };

                // Update local context
                login(localStorage.getItem("authToken"), updatedUser);
                alert("Cập nhật thông tin thành công! (Lưu cục bộ)");

                // Reset address selection
                setSelectedProvinceCode("");
                setSelectedDistrictCode("");
                setSelectedWardCode("");
                setSpecificAddress("");
                setLoading(false);
                return;
            }

            const response = await fetch(`http://127.0.0.1:8080/api/public/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                // Update local context
                login(localStorage.getItem("authToken"), updatedUser);
                alert("Cập nhật thông tin thành công!");

                // Reset address selection
                setSelectedProvinceCode("");
                setSelectedDistrictCode("");
                setSelectedWardCode("");
                setSpecificAddress("");
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to update: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error("Update failed:", error);
            alert(`Có lỗi xảy ra: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

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
                                        className="list-group-item list-group-item-action active border-0 d-flex align-items-center"
                                        to="/profile"
                                        style={{ padding: '15px 20px', fontWeight: '500' }}
                                    >
                                        <i className="fa fa-user mr-3"></i>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link
                                        className="list-group-item list-group-item-action border-0 d-flex align-items-center"
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
                                <h4 className="mb-0 font-weight-bold">Thông Tin Cá Nhân</h4>
                                <small className="text-muted">Quản lý thông tin cá nhân của bạn</small>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        {/* Form Fields */}
                                        <div className="col-md-8">
                                            <div className="form-row">
                                                <div className="col-md-6 form-group">
                                                    <label className="font-weight-bold small">Họ</label>
                                                    <input
                                                        name="firstName"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        style={{ height: '45px' }}
                                                    />
                                                </div>
                                                <div className="col-md-6 form-group">
                                                    <label className="font-weight-bold small">Tên</label>
                                                    <input
                                                        name="lastName"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        style={{ height: '45px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="font-weight-bold small">Email</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    className="form-control bg-light"
                                                    value={formData.email}
                                                    readOnly
                                                    disabled
                                                    style={{ height: '45px' }}
                                                />
                                                <small className="text-muted">Email không thể thay đổi</small>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label className="font-weight-bold small">Số điện thoại</label>
                                                    <input
                                                        name="mobileNumber"
                                                        type="text"
                                                        className="form-control"
                                                        value={formData.mobileNumber}
                                                        onChange={handleChange}
                                                        placeholder="0123456789"
                                                        style={{ height: '45px' }}
                                                    />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-4">
                                                        <label className="font-weight-bold small">Tỉnh / Thành phố</label>
                                                        <select
                                                            className="form-control"
                                                            value={selectedProvinceCode}
                                                            onChange={handleProvinceChange}
                                                            style={{ height: '45px' }}
                                                        >
                                                            <option value="">-- Chọn Tỉnh/Thành --</option>
                                                            {provinces.map(p => (
                                                                <option key={p.code} value={p.code}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label className="font-weight-bold small">Quận / Huyện</label>
                                                        <select
                                                            className="form-control"
                                                            value={selectedDistrictCode}
                                                            onChange={handleDistrictChange}
                                                            disabled={!selectedProvinceCode}
                                                            style={{ height: '45px' }}
                                                        >
                                                            <option value="">-- Chọn Quận/Huyện --</option>
                                                            {districts.map(d => (
                                                                <option key={d.code} value={d.code}>{d.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label className="font-weight-bold small">Phường / Xã</label>
                                                        <select
                                                            className="form-control"
                                                            value={selectedWardCode}
                                                            onChange={handleWardChange}
                                                            disabled={!selectedDistrictCode}
                                                            style={{ height: '45px' }}
                                                        >
                                                            <option value="">-- Chọn Phường/Xã --</option>
                                                            {wards.map(w => (
                                                                <option key={w.code} value={w.code}>{w.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="font-weight-bold small">Số nhà, Tên đường</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={specificAddress}
                                                    onChange={(e) => setSpecificAddress(e.target.value)}
                                                    placeholder="123 Đường ABC"
                                                    style={{ height: '45px' }}
                                                />
                                                <small className="text-muted">Địa chỉ hiện tại: {formData.addressLine || formData.address}</small>
                                            </div>

                                            <div className="form-group">
                                                <label className="font-weight-bold small">Quốc gia</label>
                                                <select
                                                    name="country"
                                                    className="form-control"
                                                    value={formData.country}
                                                    onChange={handleChange}
                                                    style={{ height: '45px' }}
                                                >
                                                    <option value="Vietnam">Việt Nam</option>
                                                    <option value="United States">United States</option>
                                                    <option value="Japan">Japan</option>
                                                </select>
                                            </div>

                                            <button
                                                className="btn btn-primary btn-lg px-5 mt-3"
                                                disabled={loading}
                                                style={{ height: '50px', borderRadius: '8px' }}
                                            >
                                                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                            </button>
                                        </div>

                                        {/* Avatar */}
                                        <div className="col-md-4 text-center">
                                            <div className="mb-3">
                                                <img
                                                    src={avatar ? `http://127.0.0.1:8080/api/public/users/${user.id}/image` : "https://placehold.co/200x200/e0e0e0/666?text=Avatar"}
                                                    className="rounded-circle border shadow-sm"
                                                    alt="Avatar"
                                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <input
                                                type="file"
                                                id="avatarInput"
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append("image", file);
                                                        try {
                                                            const res = await fetch(`http://127.0.0.1:8080/api/public/users/${user.id}/image`, {
                                                                method: 'POST',
                                                                body: formData
                                                            });
                                                            if (res.ok) {
                                                                alert("Upload thành công!");
                                                                window.location.reload();
                                                            } else {
                                                                alert("Upload thất bại!");
                                                            }
                                                        } catch (err) {
                                                            console.error(err);
                                                            alert("Lỗi upload.");
                                                        }
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => document.getElementById('avatarInput').click()}
                                            >
                                                <i className="fa fa-camera mr-2"></i>
                                                Đổi ảnh đại diện
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </main>
                </div >
            </div >
        </section >
    );
};

export default Profile;
