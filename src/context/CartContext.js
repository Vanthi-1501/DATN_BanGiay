import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
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
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, size = null) => {
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
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.productId === productId && item.size === size)));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (productId, size, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.productId === productId && item.size === size
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
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
