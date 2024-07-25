import React, {useEffect, useRef, useState} from 'react';
import axiosInstance from "../AxiosConfig";
import NotificationPopup from "../components/NotificationPopup";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import DOMPurify from "quill/formats/link";
import LoadingSpinner from "../components/Loading";
import CustomFileInput from "../components/CustomFileInput";

const AboutCompany = () => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newLogo, setNewLogo] = useState(null);
    const [originalCompany, setOriginalCompany] = useState(null);
    const [errors, setErrors] = useState({});
    const [sanitizedHtml, setSanitizedHtml] = useState(null);


    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const userResponse = await axiosInstance.get('api/user/');
                setUser(userResponse.data);

                if (userResponse.data.id) {
                    const companyResponse = await axiosInstance.get(`api/companies/?user=${userResponse.data.id}`);
                    setCompany(companyResponse.data[0]);
                    setSanitizedHtml(companyResponse.data[0].description);
                    setOriginalCompany(companyResponse.data[0]);
                }
            } catch (error) {
                console.error("Error fetching user or company details", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCompany({...company, [name]: value});
    };

    const handleDescriptionChange = (value) => {
        setCompany({...company, description: value});
        setSanitizedHtml(company.description);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const allowedType = 'image/png';

            if (file.type === allowedType) {
                setNewLogo(file);
                setErrors(prevErrors => ({...prevErrors, logo: ''}));
            } else {
                setNewLogo(null);
                setErrors(prevErrors => ({...prevErrors, logo: 'Chỉ chấp nhận hình ảnh với định dạng PNG.'}));
            }
        }
    };

    const validateFields = () => {
        const newErrors = {};

        if (!company.name) newErrors.name = "Name is required";
        if (!company.address) newErrors.address = "Address is required";
        if (!company.field) newErrors.field = "Field is required";
        if (!company.phone) newErrors.phone = "Phone is required";
        if (!company.description) newErrors.description = "Description is required";
        if (!newLogo && !company.logo) newErrors.logo = "Logo is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

        try {
            const formData = new FormData();
            if (newLogo) {
                formData.append('logo', newLogo);
            } else {
                formData.append('logo', company.logo);
            }
            formData.append('name', company.name);
            formData.append('address', company.address);
            formData.append('field', company.field);
            formData.append('phone', company.phone);
            formData.append('description', company.description);

            await axiosInstance.put(`api/companies/${company.id}/`, formData);
            setNotification('Information changed successfully');
            setError('false');
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating company details", error);
            setNotification('Error saving data');
            setError('true');
        }
    };

    const handleCancel = () => {
        setCompany(originalCompany);
        setNewLogo(null);
        setIsEditing(false);
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl">
            <div className="flex justify-center h-fit bg-gray-100 p-6">
                <div className="w-4/5 bg-white shadow-lg rounded-lg flex space-x-4 p-6">
                    <div className="w-1/3 h-fit bg-login rounded-lg flex flex-col justify-center items-center p-6">
                        <img
                            src={newLogo ? URL.createObjectURL(newLogo) : company.logo}
                            alt={company.name}
                            className="w-40 h-40 rounded-full object-cover mb-4"
                        />
                        {isEditing && (
                            <CustomFileInput onChange={handleLogoChange} text="Chọn logo" accept="image/png"/>
                        )}
                    </div>
                    <div className="w-2/3 h-fit bg-login rounded-lg p-6">
                        {isEditing ? (
                            <>
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-bold">Name <span
                                        className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={company.name}
                                        onChange={handleInputChange}
                                        className="mb-4 w-full p-2 border rounded-lg"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                                    <label htmlFor="field" className="block mb-1 font-bold">Field <span
                                        className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="field"
                                        value={company.field}
                                        onChange={handleInputChange}
                                        className="mb-4 w-full p-2 border rounded-lg"
                                        required
                                    />
                                    {errors.field && <p className="text-red-500 text-sm">{errors.field}</p>}
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-1 font-bold">Address <span
                                        className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={company.address}
                                        onChange={handleInputChange}
                                        className="text-gray-600 mb-2 flex h-10 items-center w-full p-2 border rounded-lg"
                                        required
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block mb-1 font-bold">Phone <span
                                        className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={company.phone}
                                        onChange={handleInputChange}
                                        className="text-gray-600 mb-2 flex h-10 items-center w-full p-2 border rounded-lg"
                                        required
                                    />
                                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mb-1 font-bold">Description <span
                                        className="text-red-500">*</span></label>
                                    <ReactQuill
                                        value={company.description}
                                        onChange={handleDescriptionChange}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                                ['link'],
                                            ],
                                        }}
                                        className="mb-2"
                                        required
                                    />

                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
                                <h1 className="text-3xl font-bold mb-4 text-center">{company.name}</h1>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-24 mr-2">Email:</span> {user.email}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-24 mr-2">Field: </span>
                                    {company.field}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-24 mr-2">Address: </span> {company.address}
                                </p>
                                <p className="text-gray-600 mb-2 pt-2 flex h-fit items-center border-b border-gray-300">
                                    <span className="font-bold w-24 mr-2">Phone: </span> {company.phone}
                                </p>
                                <div className="text-gray-600 mb-2 pt-2 border-b border-gray-300 flex">
                                    <span className="font-bold block w-24 mr-2">Description:</span>
                                    <div
                                        className="custom-html-content"
                                        dangerouslySetInnerHTML={{__html: sanitizedHtml}}
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setOriginalCompany({...company});
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

export default AboutCompany;
