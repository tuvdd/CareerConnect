import React, { useState } from 'react';
import Navbar from '../components/navbar';
import AdminButtons from "../components/AdminButtons";

const AdministratorDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('users');

    return (
        <div className="bg-gray-100 min-h-screen w-screen pt-20">
            <Navbar />
            <div className="container mx-auto py-4">
                <h1 className="text-3xl font-bold mb-4">Administrator Dashboard</h1>
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${selectedSection === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => setSelectedSection('users')}
                    >
                        Manage Users
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${selectedSection === 'companies' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => setSelectedSection('companies')}
                    >
                        Manage Companies
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${selectedSection === 'jobs' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => setSelectedSection('jobs')}
                    >
                        Manage Jobs
                    </button>
                </div>

                {selectedSection === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
                        <UserList />
                    </div>
                )}

                {selectedSection === 'companies' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Companies</h2>
                        <CompanyList />
                    </div>
                )}

                {selectedSection === 'jobs' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
                        <JobManagement />
                    </div>
                )}
            </div>
        </div>
    );
};

const UserList = () => {
    const users = [
        {
            id: 1,
            name: 'Quach Xuan Phuc 1',
            email: 'john@example.com',
            gender: 'Male',
            birthday: '19/07/2002',
            address: 'Hanoi'
        },
        {
            id: 2,
            name: 'Quach Xuan Phuc 2',
            email: 'jane@example.com',
            gender: 'Male',
            birthday: '19/07/2002',
            address: 'Hanoi'
        },
    ];

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">User List</h3>
            <p className="text-sm mb-4">{users.length} Candidates</p>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4">ID</th>
                        <th className="border-b py-2 px-4">Name</th>
                        <th className="border-b py-2 px-4">Email</th>
                        <th className="border-b py-2 px-4">Gender</th>
                        <th className="border-b py-2 px-4">Birthday</th>
                        <th className="border-b py-2 px-4">Address</th>
                        <th className="border-b py-2 px-4">Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border-b py-2 px-4">{user.id}</td>
                            <td className="border-b py-2 px-4">{user.name}</td>
                            <td className="border-b py-2 px-4">{user.email}</td>
                            <td className="border-b py-2 px-4">{user.gender}</td>
                            <td className="border-b py-2 px-4">{user.birthday}</td>
                            <td className="border-b py-2 px-4">{user.address}</td>
                            <td className="border-b py-2 px-4">Resume Col</td>
                            <td className="border-b py-2 px-4"><AdminButtons/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const JobManagement = () => {
    const jobs = [
        { id: 1, title: 'Backend Developer', company: 'PTIT' },
        { id: 2, title: 'Frontend Developer', company: 'PTIT' },
    ];

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Job List</h3>
            <p className="text-sm mb-4">{jobs.length} Jobs</p>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4">ID</th>
                        <th className="border-b py-2 px-4">Title</th>
                        <th className="border-b py-2 px-4">Company</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td className="border-b py-2 px-4">{job.id}</td>
                            <td className="border-b py-2 px-4">{job.title}</td>
                            <td className="border-b py-2 px-4">{job.company}</td>
                            <td className="border-b py-2 px-4"><AdminButtons/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CompanyList = () => {
    const companies = [
        {
            id: 1,
            name: 'Microsoft',
            address: 'One Microsoft Way, Redmond, WA 98052, USA',
            email: 'contact@microsoft.com',
            phone: '+1 425-882-8080',
            field: 'Technology',
            description: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.'
        },
        {
            id: 2,
            name: 'Google',
            address: '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA',
            email: 'contact@google.com',
            phone: '+1 650-253-0000',
            field: 'Technology',
            description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.'
        }
    ];

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
                        <th className="border-b py-2 px-4">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company, index) => (
                        <tr key={index}>
                            <td className="border-b py-2 px-4">{company.id}</td>
                            <td className="border-b py-2 px-4">{company.name}</td>
                            <td className="border-b py-2 px-4">{company.address}</td>
                            <td className="border-b py-2 px-4">{company.email}</td>
                            <td className="border-b py-2 px-4">{company.phone}</td>
                            <td className="border-b py-2 px-4">{company.field}</td>
                            <td className="border-b py-2 px-4">{company.description}</td>
                            <td className="border-b py-2 px-4"><AdminButtons/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdministratorDashboard;
