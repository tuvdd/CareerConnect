import React, {useEffect, useRef, useState} from 'react';
import axiosInstance from "../AxiosConfig";
import Navbar from "../components/navbar";
import NotificationPopup from "../components/NotificationPopup";
import LoadingSpinner from "../components/Loading";

const CandidateProfile = ({candidateId}) => {
    const [user, setUser] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [originalCandidate, setOriginalCandidate] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCandidateData = async () => {
            try {
                const userResponse = await axiosInstance.get('api/user/');
                setUser(userResponse.data);

                if (userResponse.data.id) {
                    const candidateResponse = await axiosInstance.get(`api/candidates/?user=${userResponse.data.id}`);
                    setCandidate(candidateResponse.data[0]);
                    setOriginalCandidate(candidateResponse.data[0]);
                }
            } catch (error) {
                console.error("Error fetching user or candidate details", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateData();
    }, []);

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
                setErrors(prevErrors => ({...prevErrors, image: ''}));
            } else {
                setNewImage(null);
                setErrors(prevErrors => ({...prevErrors, image: 'Chỉ chấp nhận hình ảnh với định dạng PNG.'}));
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

        try {
            const formData = new FormData();
            if (newImage) {
                formData.append('image', newImage);
            } else {
                formData.append('image', candidate.image);
            }
            formData.append('firstname', candidate.firstname);
            formData.append('lastname', candidate.lastname);
            formData.append('birthday', candidate.birthday);
            formData.append('address', candidate.address);
            formData.append('gender', candidate.gender);

            await axiosInstance.put(`api/candidates/${candidate.id}/`, formData);
            setNotification('Information changed successfully');
            setError('false');
            setIsEditing(false);
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
                                        value={user.email}
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
                                <div className="flex items-center space-x-4">
                                    <label htmlFor="resume" className="block mb-1 font-bold">Resume</label>
                                    <CustomFileInput onChange={handleInputChange} text="Chọn Resune" accept="application/pdf"/>
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
                                    <span className="font-bold w-20 mr-2">Email:</span> {user.email}
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
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span
                                        className="font-bold w-20 mr-2">Resume: </span> {candidate.resume ? candidate.resume : 'None'}
                                </p>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setOriginalCandidate({...candidate});
                                    }}
                                    className="w-16 mt-4 bg-green-500 text-white font-bold p-2 rounded"
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
        </div>
    );
};

const CustomFileInput = ({ onChange, text, accept }) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onChange(e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept={accept}
            />
            <button
                type="button"
                onClick={handleClick}
                className="w-40 bg-green-500 text-white font-bold p-2 rounded mt-2"
            >
                {text}
            </button>
            {fileName && (
                <p className="mt-2 text-gray-700">Selected file: {fileName}</p>
            )}
        </div>
    );
};

export default CandidateProfile;
