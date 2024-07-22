import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faUser, faAddressCard, faRightFromBracket, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Dropdown() {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        navigate('/register');
    };

    return (
        <div className="relative flex flex-col items-center w-[340px] h-fit rounded-lg">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-white p-4 w-full flex items-center justify-between font-bold text-lg tracking-wider border-4 border-transparent active:border-gray-200 duration-300 hover:bg-gray-200 active:bg-gray-200 rounded-lg truncate"
            >
                <span>
                    {role == 'candidate' ? (
                        <>
                            <FontAwesomeIcon icon={faUser} className="mr-4" />
                            Candidate Name
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faBuilding} className="mr-4" />
                            Company Name
                        </>
                    )}
                </span>
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
            </button>
            {isOpen && (
                <div className="absolute bg-white top-full left-0 flex flex-col items-start rounded-lg p-2 w-full shadow-lg">
                    <button className="w-full h-12 text-start hover:bg-gray-200 p-2 rounded-md">
                        <FontAwesomeIcon icon={faAddressCard} className="mr-4" />
                        Profile
                    </button>
                    <button className="w-full h-12 text-start hover:bg-gray-200 p-2 rounded-md" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="mr-4" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
