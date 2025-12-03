// src/components/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useContext(AuthContext);

    // Agar user logged in hai, toh Outlet (yaani child routes - /chat, /profile) dikhayein
    // Warna login page par bhej dein
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;