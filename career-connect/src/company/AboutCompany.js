import React, {useEffect, useState} from 'react';
import axiosInstance from "../AxiosConfig";
import NotificationPopup from "../components/NotificationPopup";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import CustomFileInput from "../components/CustomFileInput";
import AdminButtonsProfile from "../components/AdminButtonsProfile";

const AboutCompany = ({company, isOwner}) => {
    const role = localStorage.getItem('role');
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newLogo, setNewLogo] = useState(null);
    const [newCompany, setNewCompany] = useState(null);
    const [errors, setErrors] = useState({});
    const [sanitizedHtml, setSanitizedHtml] = useState(null);

    useEffect(() => {
        setNewCompany(company);
        setSanitizedHtml(company.description);
    }, []);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewCompany({...newCompany, [name]: value});
    };

    const handleDescriptionChange = (value) => {
        setNewCompany({...newCompany, description: value});
        setSanitizedHtml(newCompany.description);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const allowedType = 'image/png';

            if (file.type === allowedType) {
                setNewLogo(file);
                setError('false');
            } else {
                setNewLogo(null);
                setNotification('Chỉ chấp nhận file với định dạng PDF.');
                setError('true');
            }
        }
    };

    const validateFields = () => {
        const newErrors = {};

        if (!newCompany.name) newErrors.name = "Name is required";
        if (!newCompany.address) newErrors.address = "Address is required";
        if (!newCompany.field) newErrors.field = "Field is required";
        if (!newCompany.phone) newErrors.phone = "Phone is required";
        if (!newCompany.description) newErrors.description = "Description is required";
        if (!newLogo && !newCompany.logo) newErrors.logo = "Logo is required";

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
            if (newLogo) {
                formData.append('logo', newLogo);
            } else {
                formData.append('logo', newCompany.logo);
            }
            formData.append('name', newCompany.name);
            formData.append('address', newCompany.address);
            formData.append('field', newCompany.field);
            formData.append('phone', newCompany.phone);
            formData.append('description', newCompany.description);

            await axiosInstance.put(`api/companies/${company.id}/`, formData);
            setNotification('Information changed successfully');
            setError('false');
            setIsEditing(false);
            return window.location.reload();
        } catch (error) {
            console.error("Error updating company details", error);
            setNotification('Error saving data');
            setError('true');
        }
    };

    const handleCancel = () => {
        setNewCompany(company);
        setNewLogo(null);
        setIsEditing(false);
    };

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl">
            <div className="flex justify-center h-fit bg-gray-100 p-6">
                <div className="w-4/5 bg-white shadow-lg rounded-lg flex space-x-4 p-6">
                    <div className="w-1/3 h-fit bg-login rounded-lg flex flex-col justify-center items-center p-6">
                        <img
                            src={newLogo ? URL.createObjectURL(newLogo) : newCompany?.logo}
                            alt={newCompany?.name}
                            className="w-40 h-40 rounded-md object-cover mb-4"
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
                                        value={newCompany?.name}
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
                                        value={company.user.email}
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
                                        value={newCompany?.field}
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
                                        value={newCompany?.address}
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
                                        value={newCompany?.phone}
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
                                        value={newCompany?.description}
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
                                    <span className="font-bold w-24 mr-2">Email:</span> {company.user.email}
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
                                {isOwner && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setNewCompany({...company});
                                        }}
                                        className="w-16 mt-4 bg-green-500 text-white font-bold p-2 rounded"
                                    >
                                        Edit
                                    </button>
                                )}
                                {role === 'admin' && (
                                    <AdminButtonsProfile object={company} type={'companies'} />
                                )}
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
