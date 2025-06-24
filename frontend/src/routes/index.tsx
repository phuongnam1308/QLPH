import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/*Bọc Home bằng PrivateRoute */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* Các route khác */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
