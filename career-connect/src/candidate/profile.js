import React, {useEffect, useState} from 'react';
import axiosInstance from "../AxiosConfig";
import Navbar from "../components/navbar";
import NotificationPopup from "../components/NotificationPopup";
import LoadingSpinner from "../components/Loading";
import CustomFileInput from "../components/CustomFileInput";
import {useParams} from "react-router-dom";
import AdminButtonsProfile from "../components/AdminButtonsProfile";

const CandidateProfile = () => {
    const { candidateId } = useParams();
    const role = localStorage.getItem('role');
    const [currentUser, setCurrentUser] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [originalCandidate, setOriginalCandidate] = useState(null);
    const [errors, setErrors] = useState({});
    const [newResume, setNewResume] = useState({});
    const [selectedResume, setSelectedResume] = useState('');

    useEffect(() => {
        const fetchCandidateData = async () => {
            setLoading(true);
            try {
                const [currentUserResponse, candidateResponse] = await Promise.all([
                    axiosInstance.get('api/user/'),
                    axiosInstance.get(`api/candidates/${candidateId}`)
                ]);

                setCurrentUser(currentUserResponse.data);
                setCandidate(candidateResponse.data);
                setOriginalCandidate(candidateResponse.data);

                if (candidateResponse.data.resumes && candidateResponse.data.resumes.length > 0) {
                    setSelectedResume(candidateResponse.data.resumes[0]);
                }
            } catch (error) {
                console.error("Error fetching user or candidate details", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        const resetData = () => {
            setNotification('');
            setError('');
            setIsEditing(false);
            setNewImage(null);
            setNewResume(null);
            setSelectedResume('');
        }

        resetData();
        fetchCandidateData();
    }, [candidateId]);

    const isOwner = currentUser && candidate && currentUser.id === candidate.user.id;

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCandidate({...candidate, [name]: value});
    };

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const allowedType = 'image/png';

            if (file.type === allowedType) {
                setNewImage(file);
                setError('false');
            } else {
                setNewImage(null);
                setNotification('Chỉ chấp nhận hình ảnh với định dạng PNG.');
                setError('true');
            }
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const allowedType = 'application/pdf';

            if (file.type === allowedType) {
                setNewResume(file);
                setError('false');
            } else {
                setNewResume(null);
                setNotification('Chỉ chấp nhận file với định dạng PDF.');
                setError('true');
            }
        }
    };


    const validateFields = () => {
        const newErrors = {};

        if (!candidate.firstname) newErrors.firstname = "Firstname is required";
        if (!candidate.lastname) newErrors.lastname = "Lastname is required";
        if (!candidate.birthday) newErrors.birthday = "Birthday is required";
        if (!candidate.gender) newErrors.gender = "Gender is required";
        if (!candidate.address) newErrors.address = "Address is required";
        if (!newImage && !candidate.image) newErrors.image = "Image is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        if (error === 'true') {
            return;
        }

        try {
            const formData = new FormData();
            if (newImage) {
                formData.append('image', newImage);
            } else {
                formData.append('image', candidate.image);
            }
            if (newResume) {
                formData.append('resume', newResume);
            }
            formData.append('firstname', candidate.firstname);
            formData.append('lastname', candidate.lastname);
            formData.append('birthday', candidate.birthday);
            formData.append('address', candidate.address);
            formData.append('gender', candidate.gender);

            const response = await axiosInstance.put(`api/candidates/${candidate.id}/`, formData);
            setCandidate(response.data);
            setSelectedResume(response.data.resumes[0]);
            setNotification('Information changed successfully');
            setError('false');
            setIsEditing(false);
            return window.location.reload();
        } catch (error) {
            console.error("Error updating candidate details", error);
            setNotification('Error saving data');
            setError('true');
        }
    };

    const handleCancel = () => {
        setCandidate(originalCandidate);
        setNewImage(null);
        setIsEditing(false);
    };

    const handleDeleteResume = async (resumeUrl) => {
        try {
            const responseDelete = await axiosInstance.delete(`api/candidates/${candidate.id}/delete_resume/`, {
                data: {resume_url: resumeUrl}
            });
            console.log(responseDelete.data.status);

            const response = await axiosInstance.get(`api/candidates/${candidate.id}/`);
            setCandidate(response.data);

            setNotification('Resume deleted successfully');
            setError('false');
        } catch (error) {
            console.error("Error deleting resume", error);
            setNotification('Error deleting resume');
            setError('true');
        }
    }


    if (loading) return <LoadingSpinner/>;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
            <div className="flex justify-center h-fit bg-gray-100 p-6">
                <div className="w-4/5 bg-white shadow-lg rounded-lg flex space-x-4 p-6">
                    <div className="w-1/3 h-fit bg-login rounded-lg flex flex-col justify-center items-center p-6">
                        <img
                            src={newImage ? URL.createObjectURL(newImage) : candidate.image}
                            alt={`${candidate.firstname} ${candidate.lastname}`}
                            className="w-40 h-40 rounded-full object-cover mb-4"
                        />
                        {isEditing && (
                            <CustomFileInput onChange={handleImageChange} text="Chọn hình ảnh" accept="image/png"/>
                        )}
                    </div>
                    <div className="w-2/3 h-fit bg-login rounded-lg p-6">
                        {isEditing ? (
                            <>
                                <div className="flex space-x-2">
                                    <div className="w-1/2">
                                        <label htmlFor="firstname"
                                               className="block mb-1 font-bold">Firstname <span
                                            className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={candidate.firstname}
                                            onChange={handleInputChange}
                                            className="mb-4 w-full p-2 border rounded-lg"
                                            required
                                        />
                                        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="lastname"
                                               className="block mb-1 font-bold">Lastname <span
                                            className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={candidate.lastname}
                                            onChange={handleInputChange}
                                            className="mb-4 w-full p-2 border rounded-lg"
                                            required
                                        />
                                        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="w-full block mb-1 font-bold">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={candidate.user.email}
                                        disabled
                                        className="mb-1 w-full p-2 border rounded-lg bg-gray-200"
                                    />
                                    <p className="text-red-600 mb-2 flex items-center">Bạn không thể thay đổi email!</p>
                                </div>
                                <div>
                                    <label htmlFor="birthday"
                                           className="block mb-1 font-bold">Birthday <span
                                        className="text-red-500">*</span></label>
                                    <div className="relative mb-4">
                                        <input
                                            type="date"
                                            name="birthday"
                                            value={candidate.birthday}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded-lg"
                                            required
                                        />
                                    </div>
                                    {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block mb-1 font-bold">Gender <span
                                        className="text-red-500">*</span></label>
                                    <select
                                        name="gender"
                                        value={candidate.gender}
                                        onChange={handleInputChange}
                                        className="text-gray-600 mb-2 flex h-10 items-center w-full p-2 border rounded-lg"
                                    >
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-1 font-bold">Address <span
                                        className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={candidate.address}
                                        onChange={handleInputChange}
                                        className="text-gray-600 mb-2 flex h-10 items-center w-full p-2 border rounded-lg"
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>
                                <div>
                                    <label htmlFor="resumes" className="block mb-1 font-bold">Resume</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-4 flex-grow">
                                            {candidate.resumes && candidate.resumes.length > 0 ? (
                                                <>
                                                    <select
                                                        value={selectedResume}
                                                        onChange={(e) => setSelectedResume(e.target.value)}
                                                        className="w-1/3 p-2 border rounded-lg"
                                                    >
                                                        {candidate.resumes.map((resume, index) => (
                                                            <option key={index} value={resume}>
                                                                Resume {index + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {selectedResume && (
                                                        <div className="flex items-center space-x-4">
                                                            <a
                                                                className="py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-700 transition duration-300 ease-in-out"
                                                                href={selectedResume}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Xem Resume
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteResume(selectedResume)}
                                                                className="py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-700"
                                                            >
                                                                Xóa Resume
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <p>Không có resume nào</p>
                                            )}
                                        </div>
                                    </div>
                                    <CustomFileInput onChange={handleResumeChange} text="Thêm Resume"
                                                     accept="application/pdf"/>
                                </div>
                                <div className="flex justify-start space-x-4 mt-4">
                                    <button
                                        onClick={handleSave}
                                        className="w-16 bg-green-500 text-white font-bold p-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="w-16 bg-red-500 text-white font-bold p-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold mb-4 text-center">{`${candidate.firstname} ${candidate.lastname}`}</h1>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-20 mr-2">Email:</span> {candidate.user.email}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-20 mr-2">Birthday: </span>
                                    {new Date(candidate.birthday).toLocaleDateString('en-GB')}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-20 mr-2">Gender: </span> {candidate.gender}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-20 mr-2">Address: </span> {candidate.address}
                                </p>
                                <p className="text-gray-600 mb-2 py-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-20 mr-2">Resume: </span>
                                    {candidate.resumes && candidate.resumes.length > 0 ? (
                                        <select
                                            value={selectedResume}
                                            onChange={(e) => setSelectedResume(e.target.value)}
                                            className="w-1/3 p-2 border rounded-lg mr-2"
                                        >
                                            {candidate.resumes.map((resume, index) => (
                                                <option key={index} value={resume}>
                                                    Resume {index + 1}
                                                </option>
                                            ))}
                                        </select>
                                    ) : 'Không có resume nào'}

                                    {selectedResume && (
                                        <a
                                            className="py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-700 transition duration-300 ease-in-out"
                                            href={selectedResume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Xem Resume
                                        </a>
                                    )}
                                </p>
                                {isOwner && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setOriginalCandidate({...candidate});
                                        }}
                                        className="w-16 mt-4 bg-green-500 text-white font-bold p-2 rounded"
                                    >
                                        Edit
                                    </button>
                                )}
                                {role === 'admin' && (
                                    <AdminButtonsProfile object={candidate} type={'candidates'} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
        </div>
    )

};

export default CandidateProfile;
