import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Register from './user/register/Register';
import { BrowserRouter,Route, Routes  } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);