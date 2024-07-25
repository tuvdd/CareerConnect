import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Navbar from '../components/navbar';
import AdminButtons from "../components/AdminButtons";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdministratorDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('dashboard');

    const candidateCount = 2; // Dữ liệu giả, cần thay thế bằng dữ liệu thực tế
    const jobCount = 2; // Dữ liệu giả, cần thay thế bằng dữ liệu thực tế
    const companyCount = 2; // Dữ liệu giả, cần thay thế bằng dữ liệu thực tế

    const topJobsData = {
        labels: ['Backend Developer', 'Frontend Developer','job'], // Thay thế bằng dữ liệu thực tế
        datasets: [
            {
                label: 'Số lượng ứng tuyển',
                data: [10, 5,15], // Thay thế bằng dữ liệu thực tế
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const topJobsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 10 việc làm được ứng tuyển nhiều nhất',
            },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Công việc',
                },
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Số lượng ứng tuyển',
                },
            },
        },
    };

    return (
        <div className="bg-gray-100 min-h-screen w-screen pt-20">
            <Navbar />
            <div className="container mx-auto py-4">
                <h1 className="text-3xl font-bold mb-4">Administrator Dashboard</h1>
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${selectedSection === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => setSelectedSection('dashboard')}
                    >
                        Dashboard
                    </button>
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

                {selectedSection === 'dashboard' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded shadow-md text-center">
                                <h3 className="text-lg font-bold">Số lượng ứng viên</h3>
                                <p className="text-2xl">{candidateCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md text-center">
                                <h3 className="text-lg font-bold">Số lượng việc làm</h3>
                                <p className="text-2xl">{jobCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md text-center">
                                <h3 className="text-lg font-bold">Số lượng công ty</h3>
                                <p className="text-2xl">{companyCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold mb-4">Top 10 việc làm được ứng tuyển nhiều nhất</h3>
                            <Bar data={topJobsData} options={topJobsOptions} />
                        </div>
                    </div>
                )}

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
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td className="border-b py-2 px-4">{user.id}</td>
                            <td className="border-b py-2 px-4">{user.name}</td>
                            <td className="border-b py-2 px-4">{user.email}</td>
                            <td className="border-b py-2 px-4">{user.gender}</td>
                            <td className="border-b py-2 px-4">{user.birthday}</td>
                            <td className="border-b py-2 px-4">{user.address}</td>
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
        {
            id: 1,
            title: 'Backend Developer',
            company: 'Google',
            field: 'Technology',
            salary: '$120,000/year',
            location: 'Mountain View, CA',
            description: 'Develop and maintain web applications and services.'
        },
        {
            id: 2,
            title: 'Frontend Developer',
            company: 'Facebook',
            field: 'Technology',
            salary: '$110,000/year',
            location: 'Menlo Park, CA',
            description: 'Implement UI components and enhance user experience.'
        }
    ];

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Job Management</h3>
            <p className="text-sm mb-4">{jobs.length} Jobs</p>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4">ID</th>
                        <th className="border-b py-2 px-4">Title</th>
                        <th className="border-b py-2 px-4">Company</th>
                        <th className="border-b py-2 px-4">Field</th>
                        <th className="border-b py-2 px-4">Salary</th>
                        <th className="border-b py-2 px-4">Location</th>
                        <th className="border-b py-2 px-4">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job, index) => (
                        <tr key={index}>
                            <td className="border-b py-2 px-4">{job.id}</td>
                            <td className="border-b py-2 px-4">{job.title}</td>
                            <td className="border-b py-2 px-4">{job.company}</td>
                            <td className="border-b py-2 px-4">{job.field}</td>
                            <td className="border-b py-2 px-4">{job.salary}</td>
                            <td className="border-b py-2 px-4">{job.location}</td>
                            <td className="border-b py-2 px-4">{job.description}</td>
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
