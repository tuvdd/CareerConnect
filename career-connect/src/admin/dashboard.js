import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import Navbar from '../components/navbar';
import AdminButtons from "../components/AdminButtons";
import axiosInstance from "../AxiosConfig";
import LoadingSpinner from "../components/Loading";

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
    const [candidates, setCandidates] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [topJobsData, setTopJobsData] = useState({ labels: [], datasets: [] });

    const topJobsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 3 việc làm được ứng tuyển nhiều nhất',
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

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                const [candidateResponse, companyResponse, jobResponse, topJobResponse] = await Promise.all([
                    axiosInstance.get('api/candidates/'),
                    axiosInstance.get('api/companies/'),
                    axiosInstance.get('api/jobs/'),
                    axiosInstance.get('api/top-jobs/'),
                ]);

                setCandidates(candidateResponse.data || []);
                setCompanies(companyResponse.data|| []);
                setJobs(jobResponse.data || []);
                const topJobs = topJobResponse.data;

                const labels = topJobs.map(job => job.title);
                const data = topJobs.map(job => job.num_applications);

                setTopJobsData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Số lượng ứng tuyển',
                            data: data,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching system data", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchSystemData();
    }, []);

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
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
                                <p className="text-2xl">{candidates.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md text-center">
                                <h3 className="text-lg font-bold">Số lượng việc làm</h3>
                                <p className="text-2xl">{jobs.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow-md text-center">
                                <h3 className="text-lg font-bold">Số lượng công ty</h3>
                                <p className="text-2xl">{companies.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded shadow-md">
                            <h3 className="text-lg font-bold mb-4">Top 10 việc làm được ứng tuyển nhiều nhất</h3>
                            <Bar data={topJobsData} options={topJobsOptions}/>
                        </div>
                    </div>
                )}

                {selectedSection === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
                        <CandidateList candidates={candidates}/>
                    </div>
                )}

                {selectedSection === 'companies' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Companies</h2>
                        <CompanyList companies={companies}/>
                    </div>
                )}

                {selectedSection === 'jobs' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
                        <JobManagement jobs={jobs}/>
                    </div>
                )}
            </div>
        </div>
    );
};

const CandidateList = ({ candidates }) => {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Candidate List</h3>
            <p className="text-sm mb-4">{candidates.length} Candidates</p>
            <table className="w-full text-left">
                <thead>
                    <tr>
                        <th className="border-b py-2 px-4">ID</th>
                        <th className="border-b py-2 px-4">Name</th>
                        <th className="border-b py-2 px-4">Gender</th>
                        <th className="border-b py-2 px-4">Birthday</th>
                        <th className="border-b py-2 px-4">Address</th>
                        <th className="border-b py-2 px-4">Resume</th>
                        <th className="border-b py-2 px-4">Status</th>
                        <th className="border-b py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {candidates.map((candidate) => (
                        <tr key={candidate.id}>
                            <td className="border-b py-2 px-4">{candidate.id}</td>
                            <td className="border-b py-2 px-4">{candidate.firstname} {candidate.lastname}</td>
                            <td className="border-b py-2 px-4">{candidate.gender}</td>
                            <td className="border-b py-2 px-4">{new Date(candidate.birthday).toLocaleDateString()}</td>
                            <td className="border-b py-2 px-4">{candidate.address}</td>
                            <td className="border-b py-2 px-4">
                                {candidate.resume ? (
                                    <a
                                        href={candidate.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-500 hover:text-green-700 underline"
                                    >
                                        View Resume
                                    </a>
                                ) : 'None'}
                            </td>
                            <td className="border-b py-2 px-4">{candidate.active}</td>
                            <td className="border-b py-2 px-4"><AdminButtons /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const JobManagement = ({ jobs = [] }) => {
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
                        <th className="border-b py-2 px-4">Salary</th>
                        <th className="border-b py-2 px-4">Location</th>
                        <th className="border-b py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td className="border-b py-2 px-4">{job.id}</td>
                            <td className="border-b py-2 px-4">{job.title}</td>
                            <td className="border-b py-2 px-4">{job.company?.name || 'N/A'}</td>
                            <td className="border-b py-2 px-4">{job.salary}</td>
                            <td className="border-b py-2 px-4">{job.location}</td>
                            <td className="border-b py-2 px-4"><AdminButtons /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CompanyList = ({ companies = [] }) => {
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
                    <th className="border-b py-2 px-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company.id}>
                            <td className="border-b py-2 px-4">{company.id}</td>
                            <td className="border-b py-2 px-4">{company.name}</td>
                            <td className="border-b py-2 px-4">{company.address}</td>
                            <td className="border-b py-2 px-4">{company.user?.email || 'N/A'}</td>
                            <td className="border-b py-2 px-4">{company.phone}</td>
                            <td className="border-b py-2 px-4">{company.field}</td>
                            <td className="border-b py-2 px-4"><AdminButtons/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdministratorDashboard;
