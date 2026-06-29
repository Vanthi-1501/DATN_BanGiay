import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axiosInstance from '../services/axiosConfig';

const CartContext = createContext(null);

const mapBackendCart = (backendCart) => {
    if (!backendCart || !backendCart.cartItems) return [];
    return backendCart.cartItems.map(item => ({
        productId: item.product.productId,
        name: item.product.productName,
        image: item.product.image,
        price: item.product.specialPrice > 0 ? item.product.specialPrice : item.product.price,
        quantity: item.quantity,
        size: item.product.size || 40
    }));
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            if (user && user.id) {
                try {
                    const res = await axiosInstance.get(`/public/users/${user.id}/cart`);
                    setCartId(res.data.cartId);
                    const mappedItems = mapBackendCart(res.data);
                    setCartItems(mappedItems);
                } catch (error) {
                    console.error("Error fetching cart from DB:", error);
                }
            } else {
                setCartId(null);
                const savedCart = localStorage.getItem("cartItems");
                if (savedCart) {
                    try {
                        const parsed = JSON.parse(savedCart);

                        // ✅ Validate cart items - clear if invalid
                        const isValid = Array.isArray(parsed) && parsed.every(item =>
                            item.productId &&
                            item.price &&
                            item.quantity &&
                            item.productId < 1000 // Prevent very old/invalid IDs
                        );

                        if (isValid) {
                            setCartItems(parsed);
                        } else {
                            console.warn("⚠️ Invalid cart data detected, clearing cart...");
                            localStorage.removeItem("cartItems");
                            setCartItems([]);
                        }
                    } catch (error) {
                        console.error("❌ Error loading cart, clearing...", error);
                        localStorage.removeItem("cartItems");
                        setCartItems([]);
                    }
                } else {
                    setCartItems([]);
                }
            }
        };

        fetchCart();
    }, [user]);

    useEffect(() => {
        if (!user) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (product, quantity = 1, size = null) => {
        if (user && cartId) {
            try {
                const res = await axiosInstance.post(`/public/carts/${cartId}/products/${product.productId}/quantity/${quantity}`);
                const mappedItems = mapBackendCart(res.data);
                setCartItems(mappedItems);
                alert("Đã thêm vào giỏ hàng!");
            } catch (error) {
                console.error("Error adding product to cart in DB:", error);
                alert(error?.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng!");
            }
        } else {
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.productId === product.productId && item.size === size);

                if (existingItem) {
                    return prevItems.map(item =>
                        item.productId === product.productId && item.size === size
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity, size }];
                }
            });
            alert("Đã thêm vào giỏ hàng!");
        }
    };

    const removeFromCart = async (productId, size) => {
        if (user && cartId) {
            try {
                await axiosInstance.delete(`/public/carts/${cartId}/products/${productId}`);
                const res = await axiosInstance.get(`/public/users/${user.id}/cart`);
                const mappedItems = mapBackendCart(res.data);
                setCartItems(mappedItems);
            } catch (error) {
                console.error("Error removing product from cart in DB:", error);
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.size === size)));
        }
    };

    const clearCart = async () => {
        if (user && cartId) {
            try {
                await axiosInstance.delete(`/public/carts/${cartId}`);
                setCartItems([]);
            } catch (error) {
                console.error("Error clearing cart in DB:", error);
            }
        } else {
            setCartItems([]);
        }
    };

    const updateQuantity = async (productId, size, newQuantity) => {
        if (newQuantity < 1) return;

        if (user && cartId) {
            try {
                const res = await axiosInstance.put(`/public/carts/${cartId}/products/${productId}/quantity/${newQuantity}`);
                const mappedItems = mapBackendCart(res.data);
                setCartItems(mappedItems);
            } catch (error) {
                console.error("Error updating quantity in DB:", error);
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.productId === productId && item.size === size
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
