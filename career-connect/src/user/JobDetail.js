import React, { useEffect, useState } from 'react';
import axiosInstance from '../AxiosConfig';
import LoadingSpinner from '../components/Loading';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NotificationPopup from "../components/NotificationPopup";
import ConfirmationPopup from "../components/ConfirmationPopup";

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const [isCompanyOwner, setIsCompanyOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        title: '',
        salary: '',
        location: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('false');
    const [notification, setNotification] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const jobResponse = await axiosInstance.get(`api/jobs/${id}/`);
                setJob(jobResponse.data);

                const userResponse = await axiosInstance.get('api/user/');
                setUser(userResponse.data);

                let userCompanyResponse = { data: {} };
                let jobCompanyResponse = { data: {} };
                if (userResponse.data.id) {
                    userCompanyResponse = await axiosInstance.get(`api/companies/?user=${userResponse.data.id}`);
                }

                if (jobResponse.data.company) {
                    const jobCompanyResponse = await axiosInstance.get(`api/companies/${jobResponse.data.company}/`);
                    setCompany(jobCompanyResponse.data);
                }

                if (userCompanyResponse.data.id === jobCompanyResponse.data.id) {
                    setIsCompanyOwner(true);
                }
            } catch (error) {
                console.error('Error fetching job detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id]);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
    }, []);

    const handleEdit = () => {
        setFormValues({
            title: job.title,
            salary: job.salary,
            location: job.location,
            description: job.description,
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleDescriptionChange = (value) => {
        setFormValues({
            ...formValues,
            description: value,
        });
    };

    const handleSave = async () => {
        try {
            const updatedJob = {
                title: formValues.title,
                salary: formValues.salary,
                location: formValues.location,
                description: formValues.description,
                company: company.id
            };
            await axiosInstance.put(`api/jobs/${id}/`, updatedJob);
            setNotification('Job updated successfully');
            setError('false');
            setIsEditing(false);
            const response = await axiosInstance.get(`api/jobs/${id}/`);
            setJob(response.data);
        } catch (error) {
            console.error('Error updating job:', error);
            setNotification('Error updating job');
            setError('true');
            setErrors(error.response?.data || {});
        }
    };

    const handleCloseJob = async () => {
        try {
            await axiosInstance.patch(`api/jobs/${id}/`, { status: 'Closed' });
            setNotification('Job closed successfully');
            setError('false');
            window.location.reload();
        } catch (error) {
            console.error('Error closing job:', error);
            setNotification('Error closing job');
            setError('true');
        }
    };

    const confirmCloseJob = () => {
        setShowPopup(true);
    };

    const handleConfirmPopup = () => {
        handleCloseJob();
        setShowPopup(false);
    };

    const handleCancelPopup = () => {
        setShowPopup(false);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar />
            <div className="container bg-gray-100">
                <div className="flex flex-col p-4 space-y-4 items-center">
                    <CompanyInfo company={company} user={user} />
                    {isEditing ? (
                        <JobEditForm
                            formValues={formValues}
                            errors={errors}
                            onChange={handleChange}
                            onDescriptionChange={handleDescriptionChange}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    ) : (
                        <JobView
                            job={job}
                            role={role}
                            isCompanyOwner={isCompanyOwner}
                            onEdit={handleEdit}
                            onClose={confirmCloseJob}
                            showPopup={showPopup}
                            onConfirmPopup={handleConfirmPopup}
                            onCancelPopup={handleCancelPopup}
                        />
                    )}
                    <NotificationPopup error={error} message={notification} onClose={() => setNotification('')} />
                </div>
            </div>
        </div>
    );
};

const CompanyInfo = ({ company, user }) => (
    <div className="w-4/5 p-4 border border-gray-300 bg-white rounded-md shadow-lg">
        <div className="flex w-full justify-center items-center">
            <img
                src={company?.logo}
                alt="Company Logo"
                className="w-40 h-40 mr-10 border border-gray-200 shadow-lg rounded-md"
            />
            <div className="leading-9">
                <h1 className="text-2xl font-bold">{company?.name}</h1>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-4 h-4" />
                    <p>{company?.address}</p>
                </span>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 w-4 h-4" />
                    <p>{company?.phone}</p>
                </span>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4 h-4" />
                    <p>{user?.email}</p>
                </span>
            </div>
        </div>
    </div>
);

const JobView = ({ job, role, isCompanyOwner, onEdit, onClose, showPopup, onConfirmPopup, onCancelPopup }) => (
    <div className="w-4/5 p-10 bg-white border border-gray-300 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Mô tả công việc</h1>
        <h1 className="text-3xl font-bold mb-4">{job?.title}</h1>
        <p className="text-gray-700 text-md mb-2"><strong>Salary:</strong> {job?.salary}</p>
        <p className="text-gray-700 text-md mb-2"><strong>Location:</strong> {job?.location}</p>
        <p className="text-gray-700 text-md mb-2"><strong>Description:</strong></p>
        <div className="text-gray-500 text-sm mb-4 custom-html-content"
             dangerouslySetInnerHTML={{ __html: job?.description }} />
        <p className="text-gray-700 text-md mb-2"><strong>Status:</strong> {job?.status}</p>
        <p className="text-gray-400 text-sm">
            <FontAwesomeIcon icon={faClock} className="mr-2 w-4 h-4" />
            {new Date(job?.post_date).toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}
        </p>
        <div className="mt-4">
            {role === 'candidate' && (
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Apply
                </button>
            )}
            {role === 'company' && isCompanyOwner && job.status === 'Activated' && (
                <>
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </>
            )}
            {role === 'admin' && (
                <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    Hide
                </button>
            )}
            <ConfirmationPopup
                show={showPopup}
                onClose={onCancelPopup}
                onConfirm={onConfirmPopup}
                title="Confirm Close Job"
                message="Are you sure you want to close this job? This action cannot be undone."
            />
        </div>
    </div>
);

const JobEditForm = ({ formValues, errors, onChange, onDescriptionChange, onSave, onCancel }) => (
    <form className="w-4/5 p-6 bg-white border border-gray-300 rounded-md shadow-lg">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={onChange}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Salary</label>
            <input
                type="text"
                name="salary"
                value={formValues.salary}
                onChange={onChange}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
            <input
                type="text"
                name="location"
                value={formValues.location}
                onChange={onChange}
                className="border border-gray-300 p-2 rounded-md w-full"
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <ReactQuill
                value={formValues.description}
                onChange={onDescriptionChange}
                className="border border-gray-300 rounded-md"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        <div className="flex space-x-4">
            <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={onSave}
            >
                Save
            </button>
            <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    </form>
);

export default JobDetail;
