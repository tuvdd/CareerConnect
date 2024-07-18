
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter và Route
import './index.css';
import Register from './user/register/Register'
import CandidateHomepage from "./candidate/homepage";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<CandidateHomepage />}></Route>
        <Route path="/register" element={<Register />}></Route>
        
      </Routes>
    </BrowserRouter>
);
