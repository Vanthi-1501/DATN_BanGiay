import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL + "/api",
    timeout: 20000,
});

// ✅ Request interceptor: tự gắn token nếu có
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // đảm bảo không gửi Authorization rác
            if (config.headers && config.headers.Authorization) {
                delete config.headers.Authorization;
            }
        }

        config.headers["Content-Type"] = "application/json";
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response interceptor: nếu 401 thì đá về /login 1 lần
let redirecting = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // IMPORTANT: route login của bạn dùng "/login" hay "/Login" thì thống nhất 1 cái
        if (status === 401 && !redirecting) {
            redirecting = true;
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
