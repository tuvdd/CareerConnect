import React from "react";

const JobCard = ({logo, title, company, salary, location, description, skills, timePosted}) => {
    return (
        <div className="border border-white shadow-md rounded-md p-4 bg-white my-2">
            <div className="flex items-center mb-4">
                <img src={logo} alt={`${company} Logo`} className="w-40 h-24 mr-4 border border-gray-200 shadow-md rounded-md"/>
                <div>
                    <h3 className="text-red-600 font-bold">{title}</h3>
                    <p className="text-gray-700">{company}</p>
                    <p className="text-red-500">{salary}</p>
                    <p className="text-gray-500">{location}</p>
                    <div className="mb-4">
                        <p className="text-gray-700">
                            <ul className="list-disc ml-6">
                                {description.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{skill}</span>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-4">{timePosted}</p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;