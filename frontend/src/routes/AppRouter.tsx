import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Room from "../pages/Room";

const AppRouter = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="booking" element={<Booking />} />
        <Route path="*" element={<NotFound />} />
        <Route path="rooms" element={<Room />} />
      </Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
