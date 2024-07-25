import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faAddressCard,
    faBuilding,
    faCaretDown,
    faCaretUp,
    faRightFromBracket,
    faUser,
    faUserTie
} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";
import axiosInstance from "../AxiosConfig";

function Dropdown() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [company, setCompany] = useState(null);
    const [admin, setAdmin] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        navigate('/register');
    };

    const goToProfile = () => {
        if (role === 'candidate') {
            navigate('/candidate-profile');
        } else if (role === 'company') {
            navigate('/company-profile');
        } else {
            navigate('/admin');
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userResponse = await axiosInstance.get('api/user/');
                setUser(userResponse.data);

                if (userResponse.data.id) {
                    if (role === 'candidate') {
                        const candidateResponse = await axiosInstance.get(`api/candidates/?user=${userResponse.data.id}`);
                        setCandidate(candidateResponse.data[0]);
                    } else if (role === 'company') {
                        const companyResponse = await axiosInstance.get(`api/companies/?user=${userResponse.data.id}`);
                        setCompany(companyResponse.data[0]);
                    } else {
                        const adminResponse = await axiosInstance.get(`api/admin/?user=${userResponse.data.id}`);
                        setAdmin(adminResponse.data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching user or candidate details", error);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <div className="relative flex flex-col items-center w-[340px] h-fit rounded-lg">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-white p-4 w-full flex items-center justify-between font-bold text-lg tracking-wider border-4 border-transparent active:border-gray-200 duration-300 hover:bg-gray-200 active:bg-gray-200 rounded-lg"
            >
                <span className="flex items-center truncate w-full">
                    {role === 'candidate' ? (
                        <>
                            <FontAwesomeIcon icon={faUser} className="mr-4"/>
                            {candidate ? `${candidate.firstname} ${candidate.lastname}` : "Loading..."}
                        </>
                    ) : role === 'company' ? (
                        <>
                            <FontAwesomeIcon icon={faBuilding} className="mr-4"/>
                            {company ? `${company.name}` : "Loading..."}
                        </>
                    ) : role === 'admin' ? (
                        <>
                            <FontAwesomeIcon icon={faUserTie} className="mr-4"/>
                            {admin ? `${admin.adminname}` : "Loading..."}
                        </>
                    ) : null}
                </span>
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown}/>
            </button>
            {isOpen && (
                <div
                    className="absolute bg-white top-full left-0 flex flex-col items-start rounded-lg p-2 w-full shadow-lg">
                    <button className="w-full h-12 text-start hover:bg-gray-200 p-2 rounded-md" onClick={goToProfile}>
                        <FontAwesomeIcon icon={faAddressCard} className="mr-4"/>
                        Profile
                    </button>
                    <button className="w-full h-12 text-start hover:bg-gray-200 p-2 rounded-md" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="mr-4"/>
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
