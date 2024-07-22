import React from "react";
import {useNavigate} from 'react-router-dom';
import Dropdown from "./Dropdown";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMessage} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogoClick = () => {
        if (isAuthenticated) {
            navigate(`/${role}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className={"w-full h-20 bg-white fixed top-0 z-50 shadow-md"}>
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <div onClick={handleLogoClick} className="cursor-pointer">
                        <img
                            className="w-auto h-14"
                            src="/logo.png"
                            alt="Your Logo"
                        />
                    </div>
                    <p className="font-extrabold text-2xl">CAREER CONNECT</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex">
                        <button><FontAwesomeIcon icon={faMessage}
                                                 className="mr-4 p-6 hover:bg-gray-200 active:bg-gray-200 rounded-lg"/>
                        </button>
                        <Dropdown/>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;