import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppliedJob from "./candidate/AppliedJobs";
import Register from "./user/register/Register";
import Homepage from "./user/homepage";
import CandidateProfile from "./candidate/profile";
import CompanyProfile from "./company/profile";
import AdministratorDashboard from "./admin/dashboard";
import JobDetail from "./user/JobDetail";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const authProviderValue = { isAuthenticated, setIsAuthenticated, role, setRole };

    return (
        <AuthContext.Provider value={authProviderValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route path="/" element={<Navigate to="/register" replace />} />
                    <Route path="/list-of-applied-jobs/:candidateId"
                           element={(isAuthenticated && role === 'candidate') ? <AppliedJob /> : <Navigate to="/register" replace />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={(isAuthenticated) ? <Homepage /> : <Navigate to="/register" replace />} />
                    <Route path="/candidate-profile/:candidateId"
                           element={(isAuthenticated) ? <CandidateProfile /> : <Navigate to="/register" replace />} />
                    <Route path="/company-profile/:companyId"
                           element={(isAuthenticated) ? <CompanyProfile /> : <Navigate to="/register" replace />} />
                    <Route path="/admin" element={(isAuthenticated && role === 'admin') ? <AdministratorDashboard /> : <Navigate to="/register" replace />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
