import React from "react";

const JobCard = ({logo, title, company, salary, location, description, timePosted}) => {
    return (
        <div className="border border-white shadow-md rounded-md p-4 bg-white my-2">
            <div className="flex items-center mb-4">
                <img src={logo} alt={`${company} Logo`} className="w-40 h-24 mr-4 border border-gray-200 shadow-md rounded-md"/>
                <div>
                    <h3 className="text-red-600 font-bold">{title}</h3>
                    <p className="text-gray-700">{company}</p>
                    <p className="text-red-500">{salary}</p>
                    <p className="text-gray-500">{location}</p>
                    <p className="text-gray-400 text-sm mt-4">{description}</p>
                    <p className="text-gray-400 text-sm mt-4">{timePosted}</p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;