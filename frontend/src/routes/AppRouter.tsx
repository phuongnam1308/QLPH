import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home"; 
import RoomPage from "../pages/Room";
import Login from "../pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import BookingAdmin from "../pages/BookingAmin";
const AppRouter = (): React.JSX.Element => (
<BrowserRouter>
    <Routes>
    <Route path="/admin" element={<AdminLayout />}>
        <Route path="bookings" element={<BookingAdmin />} />
        <Route path="rooms" element={<RoomPage />} /> 
    </Route>

    <Route path="/" element={<MainLayout />}>
        <Route index element={
            <PrivateRoute>
                <Home />
            </PrivateRoute>
        } />
        <Route path="rooms" element={<RoomPage />} />
        
    </Route>

    <Route path="/login" element={<Login />} />
    </Routes>
</BrowserRouter>
);

export default AppRouter;
