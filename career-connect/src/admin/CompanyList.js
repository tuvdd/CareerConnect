import AdminButtons from "../components/AdminButtons";
import React from "react";

const CompanyList = ({companies = []}) => {
    const handleCompanyClick = (companyId) => {
        window.open(`/company-profile/${companyId}`, '_blank');
    }

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Company List</h3>
            <p className="text-sm mb-4">{companies.length} Companies</p>
            <table className="w-full text-left">
                <thead>
                <tr>
                    <th className="border-b py-2 px-4">ID</th>
                    <th className="border-b py-2 px-4">Name</th>
                    <th className="border-b py-2 px-4">Address</th>
                    <th className="border-b py-2 px-4">Email</th>
                    <th className="border-b py-2 px-4">Phone</th>
                    <th className="border-b py-2 px-4">Field</th>
                    <th className="border-b py-2 px-4">Status</th>
                    <th className="border-b py-2 px-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                {companies.map((company) => (
                    <tr key={company.id} className={`${company.status === 'Activated' ? 'bg-white' : 'bg-gray-200'}`}>
                        <td className="border-b py-2 px-4">{company.id}</td>
                        <td className="border-b py-2 px-4 hover:cursor-pointer underline text-blue-400"
                            onClick={() => handleCompanyClick(company.id)}
                        >
                            {company.name}
                        </td>
                        <td className="border-b py-2 px-4">{company.address}</td>
                        <td className="border-b py-2 px-4">{company.user?.email || 'N/A'}</td>
                        <td className="border-b py-2 px-4">{company.phone}</td>
                        <td className="border-b py-2 px-4">{company.field}</td>
                        <td className="border-b py-2 px-4">{company.status}</td>
                        <td className="border-b py-2 px-4"><AdminButtons object={company} type={'companies'}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyList;