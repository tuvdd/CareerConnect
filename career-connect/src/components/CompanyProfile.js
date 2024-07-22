// CompanyProfile.js
import React, { useState } from 'react';

const CompanyProfile = () => {
    const [isEditingCompany, setIsEditingCompany] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);

    const [companyInfo, setCompanyInfo] = useState({
        name: 'PTIT',
        description: 'Thông tin công ty...',
    });

    const [contactInfo, setContactInfo] = useState({
        email: 'contact@ptit.com',
        phone: '123-456-789',
    });

    const [newCompanyInfo, setNewCompanyInfo] = useState(companyInfo);
    const [newContactInfo, setNewContactInfo] = useState(contactInfo);

    const handleCompanyInfoChange = (e) => {
        const { name, value } = e.target;
        setNewCompanyInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactInfoChange = (e) => {
        const { name, value } = e.target;
        setNewContactInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCompanySubmit = () => {
        setCompanyInfo(newCompanyInfo);
        setIsEditingCompany(false);
    };

    const handleContactSubmit = () => {
        setContactInfo(newContactInfo);
        setIsEditingContact(false);
    };

    return (
        <div className="flex w-full p-6">
            <div className="w-2/3 m-3 p-4 border-r bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Company Information</h2>
                {isEditingCompany ? (
                    <div>
                        <textarea
                            name="description"
                            value={newCompanyInfo.description}
                            onChange={handleCompanyInfoChange}
                            rows="10"
                            className="w-full border p-2 mb-4 rounded"
                        />
                        <button
                            onClick={handleCompanySubmit}
                            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="mb-4">{companyInfo.description}</p>
                        <button
                            onClick={() => setIsEditingCompany(true)}
                            className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>

            <div className="w-1/3 p-4 m-3 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                {isEditingContact ? (
                    <div>
                        <input
                            name="email"
                            type="email"
                            value={newContactInfo.email}
                            onChange={handleContactInfoChange}
                            className="w-full border p-2 mb-2 rounded"
                            placeholder="Email"
                        />
                        <input
                            name="phone"
                            type="text"
                            value={newContactInfo.phone}
                            onChange={handleContactInfoChange}
                            className="w-full border p-2 mb-4 rounded"
                            placeholder="Phone"
                        />
                        <button
                            onClick={handleContactSubmit}
                            className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <div>
                        <p className="mb-2">Email: {contactInfo.email}</p>
                        <p className="mb-4">Phone: {contactInfo.phone}</p>
                        <button
                            onClick={() => setIsEditingContact(true)}
                            className="bg-yellow-500 text-white py-1 px-4 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
