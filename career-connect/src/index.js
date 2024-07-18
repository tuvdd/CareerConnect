
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter và Route
import './index.css';
import App from './App';
import Register from './user/register/Register'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/register" element={<Register />}></Route>
        
      </Routes>
    </BrowserRouter>
);
