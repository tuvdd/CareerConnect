
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter và Route
import './index.css';
import Register from './user/register/Register'
import CandidateHomepage from "./candidate/homepage";
import CompanyHomepage from "./company/homepage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<CandidateHomepage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/company" element={<CompanyHomepage />}></Route>
      </Routes>
    </BrowserRouter>
);
