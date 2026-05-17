import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="spinner-border text-dark" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Không cho phép truy cập nếu chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Ở đây có thể thêm logic kiểm tra Role, ví dụ: 
  // if (user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
