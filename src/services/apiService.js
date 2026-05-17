import axiosInstance from "./axiosConfig";

/**
 * Helper function to handle API calls
 * endpoint: "/orders", "/public/products", ...
 */
function callApi(endpoint, method = "GET", body = null, params = null) {
    const config = {
        method,
        url: endpoint,
        params,
        data: body,
        headers: {
            "Content-Type": "application/json",
        },
    };

    console.log(`[API] ${method} ${endpoint}`, {
        params,
        body,
    });

    return axiosInstance(config)
        .then((response) => response.data)
        .catch((error) => {
            console.error(
                "[API ERROR]",
                method,
                endpoint,
                "STATUS:",
                error?.response?.status,
                "DATA:",
                error?.response?.data
            );
            throw error;
        });
}

/* --- GENERIC --- */
export function GET_ALL(endpoint, params) {
    return callApi(endpoint, "GET", null, params);
}

export function GET_ID(endpoint, id) {
    return callApi(`${endpoint}/${id}`, "GET");
}

export function POST_ADD(endpoint, data) {
    return callApi(endpoint, "POST", data);
}

export function PUT_EDIT(endpoint, data) {
    return callApi(endpoint, "PUT", data);
}

export function DELETE_ID(endpoint) {
    return callApi(endpoint, "DELETE");
}

/* --- AUTH --- */
export function LOGIN(body) {
    return callApi("/auth/login", "POST", body);
}

export function REGISTER(body) {
    return callApi("/auth/register", "POST", body);
}

export function FORGOT_PASSWORD(email) {
    return callApi("/public/auth/forgot-password", "POST", { email });
}

export function VERIFY_RESET_CODE(email, code) {
    return callApi("/public/auth/verify-reset-code", "POST", { email, code });
}

export function RESET_PASSWORD(resetSession, newPassword) {
    return callApi("/public/auth/reset-password", "POST", { resetSession, newPassword });
}

/* --- PUBLIC HELPERS (tuỳ bạn dùng) --- */
export const getAllAddresses = () => GET_ALL("/public/addresses");
export const getAllCategories = (params) => GET_ALL("/public/categories", params);
export const getAllProducts = (params) => GET_ALL("/public/products", params);
export const searchProducts = (keyword, params) =>
    GET_ALL(`/public/products/keyword/${keyword}`, params);
export const getProductById = (id) => GET_ID("/public/products", id);

/* --- PAYMENT (nếu bạn có endpoint Java /payment) --- */
export function createPayment(checkoutRequest) {
    return POST_ADD("/payment", checkoutRequest);
}

/* --- ORDER --- */
export function createOrder(orderData) {
    return POST_ADD("/orders", orderData);
}

/**
 * ✅ Confirm VNPay return: FE gửi query params về backend Java để verify + update order
 * Backend Java bạn cần có GET /payments/vnpay-return
 */
export function confirmVnpayReturn(queryObj) {
    return callApi("/payments/vnpay-return", "GET", null, queryObj);
}

export function getOrdersByUser(userId) {
    return GET_ALL(`/orders/user/${userId}`);
}

export function getOrdersByEmail(email) {
    return GET_ALL(`/orders/email/${encodeURIComponent(email)}`);
}

/* --- SMART SEARCH --- */
export function SEARCH_PRODUCTS_SMART(params) {
    // params: { keyword, brand, minPrice, maxPrice, sort, page, limit }
    // Map frontend sort keys to backend expectation if needed, or pass directly
    return GET_ALL("/search/products", params);
}

export function GET_SEARCH_SUGGESTIONS(keyword) {
    return GET_ALL("/search/suggestions", { keyword });
}

export function GET_HOT_KEYWORDS() {
    return GET_ALL("/search/hot-keywords");
}

export function GET_SEARCH_HISTORY() {
    return GET_ALL("/search/history");
}

export function CLEAR_SEARCH_HISTORY() {
    return DELETE_ID("/search/history");
}
