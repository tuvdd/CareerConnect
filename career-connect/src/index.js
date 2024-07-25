import React from 'react';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"; // Import BrowserRouter và Route
import './index.css';
import Register from './user/register/Register'
import CompanyProfile from "./company/profile";
import AdministratorDashboard from "./admin/dashboard";
import CandidateProfile from "./candidate/profile";
import Homepage from "./homepage";

const root = ReactDOM.createRoot(document.getElementById('root'));
const isAuthenticated = !!localStorage.getItem('token');
const role = localStorage.getItem('role');
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={(isAuthenticated) ? <Homepage /> : <Navigate to="/register" replace />} />
            <Route path="/candidate-profile/" element={(isAuthenticated && role === 'candidate') ? <CandidateProfile /> : <Navigate to="/register" replace />} />
            <Route path="/company-profile/" element={(isAuthenticated && role === 'company') ? <CompanyProfile /> : <Navigate to="/register" replace />} />
            <Route path="/admin" element={(isAuthenticated && role === 'admin') ? <AdministratorDashboard /> : <Navigate to="/register" replace />} />
        </Routes>
    </BrowserRouter>
);
