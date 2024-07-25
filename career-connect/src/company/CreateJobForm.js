import React from "react";

const CreateJobForm = () => {
    return (
        <form className="w-3/5 bg-white p-6 rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700">Job Title</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter job title"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Company Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter company name"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Salary</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter salary"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Location</label>
                <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Enter location"/>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea className="w-full px-3 py-2 border rounded" placeholder="Enter job description"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
        </form>
    );
};

export default CreateJobForm;