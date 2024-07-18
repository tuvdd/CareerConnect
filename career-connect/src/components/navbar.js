import React from "react";
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className={"w-full h-20 bg-white"}>
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Link to="/">
                        <img
                            className="w-auto h-14"
                            src="/logo.png"
                            alt="Your Logo"
                        />
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/register">
                        <button className="border-none bg-red-500 rounded px-5 py-3 text-white font-bold">
                            Đăng nhập
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;