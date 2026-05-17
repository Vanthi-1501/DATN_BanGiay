import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './admin/layouts/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Products from './admin/pages/Products';
import Categories from './admin/pages/Categories';
import Orders from './admin/pages/Orders';
import Customers from './admin/pages/Customers';
import Banners from './admin/pages/Banners';
import Reviews from './admin/pages/Reviews';
import Coupons from './admin/pages/Coupons';
import Settings from './admin/pages/Settings';
import ProtectedRoute from './admin/components/ProtectedRoute';

import "./assets/sass/bootstrap.scss";
import "./assets/sass/app.scss";
import "./assets/css/modern-theme.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="banners" element={<Banners />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Client Routes */}
          <Route path="/*" element={<ClientLayout />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;