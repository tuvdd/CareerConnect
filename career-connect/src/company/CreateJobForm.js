import React, {useEffect, useState} from "react";
import axiosInstance from "../AxiosConfig";
import LoadingSpinner from "../components/Loading";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import NotificationPopup from "../components/NotificationPopup";

const CreateJobForm = ({ company }) => {
    const [title, setTitle] = useState("");
    const [salary, setSalary] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};

        if (!title) newErrors.title = "Title is required";
        if (!salary) newErrors.salary = "Salary is required";
        if (!location) newErrors.location = "Location is required";
        if (!description) newErrors.description = "Description is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            return;
        }

        const jobData = {
            title,
            salary,
            location,
            description,
            company: company?.id
        };

        console.log(jobData)

        try {
            const response = await axiosInstance.post("/api/jobs/create/", jobData);
            console.log("Job created successfully:", response.data);
            setTitle("");
            setSalary("");
            setLocation("");
            setDescription("");
            setNotification("Job created successfully.");
            setError('');
        } catch (err) {
            console.error("Error creating job:", err);
            setNotification("Failed to create job. Please try again.");
            setError('true');
        }
    };

    return (
        <div className="container bg-gray-100 max-w-screen-2xl">
            <div className="flex justify-center h-fit bg-gray-100 p-6">
                <form className="w-3/5 bg-white p-6 rounded shadow-lg" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-1 font-bold">Title <span
                            className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="title"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter job title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salary" className="block mb-1 font-bold">Salary <span
                            className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="salary"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block mb-1 font-bold">Location <span
                            className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="location"
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Enter location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block mb-1 font-bold">Description <span
                            className="text-red-500">*</span></label>
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            modules={{
                                toolbar: [
                                    [{ 'font': [] }, { 'size': [] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                    ['link'],
                                ],
                            }}
                            className="mb-2"
                            required
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </form>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
        </div>
    );
};

export default CreateJobForm;
