import React, {useEffect, useState} from 'react';
import axiosInstance from '../AxiosConfig';
import LoadingSpinner from '../components/Loading';
import {useParams} from 'react-router-dom';
import Navbar from '../components/navbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faLocationDot, faPhone} from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import NotificationPopup from "../components/NotificationPopup";
import ConfirmationPopup from "../components/ConfirmationPopup";
import {formatDistanceToNow, parseISO} from "date-fns";
import {vi} from "date-fns/locale";

const JobDetail = () => {
    const {id} = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [job, setJob] = useState(null);
    const [company, setCompany] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');
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
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [showResumeSelector, setShowResumeSelector] = useState(false);
    const [applicationsByJob, setApplicationsByJob] = useState([]);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const [currentUserResponse, jobResponse, applicationsResponse] = await Promise.all([
                    axiosInstance.get('api/user/'),
                    axiosInstance.get(`api/jobs/${id}/`),
                    axiosInstance.get(`api/jobs/${id}/applications/`)
                ]);

                setJob(jobResponse.data);
                setCompany(jobResponse.data.company);
                setCurrentUser(currentUserResponse.data);
                setApplicationsByJob(applicationsResponse.data);

                let userCompanyResponse = {data: {}};
                let apiUrl = '';
                switch (currentUserResponse.data.role) {
                    case 'candidate':
                        apiUrl = `api/candidates/?user=${currentUserResponse.data.id}`;
                        const candidateResponse = await axiosInstance.get(apiUrl);
                        setCandidate(candidateResponse.data[0]);
                        break;
                    case 'company':
                        apiUrl = `api/companies/?user=${currentUserResponse.data.id}`;
                        userCompanyResponse = await axiosInstance.get(apiUrl);
                        break;
                    case 'admin':
                        apiUrl = `api/admin/?user=${currentUserResponse.data.id}`;
                        const adminResponse = await axiosInstance.get(apiUrl);
                        setAdmin(adminResponse.data[0]);
                        break;
                    default:
                        console.error('Invalid user role');
                }

                if (userCompanyResponse && userCompanyResponse.data[0].id === jobResponse.data.company.id) {
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
                company: company.company,
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
            await axiosInstance.patch(`api/jobs/${id}/`, {status: 'Closed'});
            setNotification('Job closed successfully');
            setError('false');
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
        handleCloseJob().then(r => {
            window.location.reload();
        });
    };

    const handleCancelPopup = () => {
        setShowPopup(false);
    };

    const handleApply = async () => {
        if (!candidate?.resumes || candidate.resumes.length === 0) {
            setNotification('At least one resume is required');
            setError('true');
            return;
        }

        setShowResumeSelector(true);
    };

    const handleSelectResume = (selectedResume) => {
        const newApplication = {
            date: new Date().toISOString().split('T')[0],
            status: 'Applied',
            resume: selectedResume,
            candidate: candidate.id,
            job: job.id,
        };

        setApplicationDetails(newApplication);
        setShowPopup(true);
        setShowResumeSelector(false);
    };


    const confirmApply = async () => {
        try {
            await axiosInstance.post('api/applications/create/', applicationDetails);
            setNotification('Applied successfully');
            setError('false');
            setShowPopup(false);
        } catch (error) {
            console.error('Error applying for job:', error);
            setNotification('Error applying for job');
            setError('true');
            setShowPopup(false);
        }
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
            <div className="container bg-gray-100">
                <div className="flex flex-col p-4 space-y-4 items-center">
                    <CompanyInfo company={company}/>
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
                            onApply={handleApply}
                            confirmApply={confirmApply}
                            application={applicationDetails}
                            candidate={candidate}
                        />
                    )}
                    {showResumeSelector && (
                        <ResumeSelector
                            resumes={candidate?.resumes || []}
                            onSelect={handleSelectResume}
                            onClose={() => setShowResumeSelector(false)}
                        />
                    )}
                    <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
                    {role === 'company' && isCompanyOwner && (
                        <div className="w-4/5 p-4 bg-white border border-gray-300 rounded-md shadow-lg mt-4">
                            <h2 className="text-2xl font-bold mb-4">Applications</h2>
                            {applicationsByJob.length === 0 ? (
                                <p className="text-gray-700">No applications for this job yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {applicationsByJob.map(application => (
                                        <li key={application.id} className="border-b border-gray-300 pb-2 mb-2">
                                            <p className="text-gray-700">
                                                <strong>Candidate:</strong> {application.candidate.firstname} {application.candidate.lastname}
                                            </p>
                                            <p className="text-gray-700"><strong>Status:</strong> {application.status}
                                            </p>
                                            <p className="text-gray-700"><strong>Date:</strong> {application.date}</p>
                                            <a href={application.resume} className="text-blue-500 hover:underline"
                                               target="_blank" rel="noopener noreferrer">View Resume</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )};
                </div>
            </div>
        </div>
    );
};

const CompanyInfo = (company) => (
    <div className="w-4/5 p-4 border border-gray-300 bg-white rounded-md shadow-lg">
        <div className="flex w-full justify-center items-center">
            <img
                src={company?.company.logo}
                alt="Company Logo"
                className="w-40 h-40 mr-10 border border-gray-200 shadow-lg rounded-md"
            />
            <div className="leading-9">
                <h1 className="text-2xl font-bold">{company?.company.name}</h1>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-4 h-4"/>
                    <p>{company?.company.address}</p>
                </span>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 w-4 h-4"/>
                    <p>{company?.company.phone}</p>
                </span>
                <span className="flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4 h-4"/>
                    <p>{company?.company.user.email}</p>
                </span>
            </div>
        </div>
    </div>
);

const JobView = ({
                     job,
                     role,
                     isCompanyOwner,
                     onEdit,
                     onClose,
                     showPopup,
                     onConfirmPopup,
                     onCancelPopup,
                     onApply,
                     confirmApply,
                     application,
                     candidate
                 }) => (
    <div className="w-4/5 p-10 bg-white border border-gray-300 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Mô tả công việc</h1>
        <h1 className="text-3xl font-bold mb-4">{job?.title}</h1>
        <p className="text-gray-700 text-md mb-2"><strong>Salary:</strong> {job?.salary}</p>
        <p className="text-gray-700 text-md mb-2"><strong>Location:</strong> {job?.location}</p>
        <p className="text-gray-700 text-md mb-2"><strong>Description:</strong></p>
        <div className="text-gray-500 text-sm mb-4 custom-html-content"
             dangerouslySetInnerHTML={{__html: job?.description}}/>
        <p className="text-gray-700 text-md mb-2">
            <strong>Posted:</strong> {formatDistanceToNow(parseISO(job?.post_date), {addSuffix: true, locale: vi})}
        </p>
        {role === 'company' && isCompanyOwner && job.status === 'Closed' && (
            <p className="text-gray-700 text-md mb-2"><strong>Status:</strong> {job.status}</p>
        )}
        <div className="flex justify-center mt-4 space-x-4">
            {role === 'candidate' && (
                <div className="flex justify-center mt-4">
                    <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onApply}
                    >
                        Apply
                    </button>
                </div>
            )}
            {role === 'company' && isCompanyOwner && job.status === 'Activated' && (
                <div className="flex justify-center mt-4 space-x-4">
                    <button
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onClose}
                    >
                        Close Job
                    </button>
                </div>
            )}
            {role === 'admin' && (
                <div className="flex justify-center mt-4">
                    <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onClose}
                    >
                        Hide Job
                    </button>
                </div>
            )}
            {role === 'company' ? (
                <ConfirmationPopup show={showPopup} title="Close job"
                                   message="Are you sure you want to close this job?"
                                   onConfirm={onConfirmPopup} onClose={onCancelPopup}/>
            ) : (
                <ConfirmationPopup
                    show={showPopup}
                    onConfirm={confirmApply}
                    onClose={onCancelPopup}
                    title="Confirm Application"
                    message={`Are you sure you want to apply for this job with the following details? \n
                            Candidate: ${candidate?.firstname} ${candidate?.lastname} \n
                            Date: ${application?.date} \n
                            Status: ${application?.status}`}
                    resumeLink={application?.resume}/>
            )}
        </div>
    </div>
);

const JobEditForm = ({formValues, errors, onChange, onDescriptionChange, onSave, onCancel}) => (
    <div className="w-4/5 p-10 bg-white border border-gray-300 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Edit Job</h1>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Job Title
            </label>
            <input
                type="text"
                name="title"
                id="title"
                value={formValues.title}
                onChange={onChange}
                className={`shadow appearance-none border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
                Salary
            </label>
            <input
                type="text"
                name="salary"
                id="salary"
                value={formValues.salary}
                onChange={onChange}
                className={`shadow appearance-none border ${errors.salary ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.salary && <p className="text-red-500 text-xs italic">{errors.salary}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location
            </label>
            <input
                type="text"
                name="location"
                id="location"
                value={formValues.location}
                onChange={onChange}
                className={`shadow appearance-none border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            />
            {errors.location && <p className="text-red-500 text-xs italic">{errors.location}</p>}
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Job Description
            </label>
            <ReactQuill value={formValues.description} onChange={onDescriptionChange} theme="snow"/>
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
        </div>
        <div className="flex justify-center mt-4 space-x-4">
            <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onSave}
            >
                Save changes
            </button>
            <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    </div>
);

const ResumeSelector = ({resumes, onSelect, onClose}) => {
    const [selectedResume, setSelectedResume] = useState('');

    const handleSelect = () => {
        if (!selectedResume) {
            alert('Please select a resume');
            return;
        }
        onSelect(selectedResume);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Select a Resume</h2>
                <select
                    className="border border-gray-300 p-2 mb-4 w-full"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                >
                    <option value="">Select a resume</option>
                    {resumes.map((resume, index) => (
                        <option key={index} value={resume}>
                            {resume}
                        </option>
                    ))}
                </select>
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSelect}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


export default JobDetail;
