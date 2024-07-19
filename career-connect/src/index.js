import React from 'react';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom"; // Import BrowserRouter và Route
import './index.css';
import Register from './user/register/Register'
import CandidateHomepage from "./candidate/homepage";
import CompanyHomepage from "./company/homepage";
import AdministratorDashboard from "./admin/dashboard";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/candidate" element={<CandidateHomepage/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/company" element={<CompanyHomepage/>}></Route>
            <Route path="/admin" element={<AdministratorDashboard/>}></Route>
        </Routes>
    </BrowserRouter>
);
