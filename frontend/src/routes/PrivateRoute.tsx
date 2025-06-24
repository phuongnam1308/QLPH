// src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');

  // Nếu chưa có token → chuyển về trang login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token → hiển thị trang được bảo vệ
  return children;
};

export default PrivateRoute;
