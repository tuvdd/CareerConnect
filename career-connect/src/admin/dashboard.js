import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';
import Navbar from '../components/navbar';
import axiosInstance from '../AxiosConfig';
import LoadingSpinner from '../components/Loading';
import CandidateList from './CandidateList';
import CompanyList from './CompanyList';
import JobList from './JobList';
import Pagination from './Pagination';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdministratorDashboard = () => {
    const [selectedSection, setSelectedSection] = useState('dashboard');
    const [candidates, setCandidates] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [topJobsData, setTopJobsData] = useState({labels: [], datasets: []});

    const [candidatePage, setCandidatePage] = useState(1);
    const [companyPage, setCompanyPage] = useState(1);
    const [jobPage, setJobPage] = useState(1);

    const itemsPerPage = 10;

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
                const [candidateResponse, companyResponse, jobResponse, topJobResponse] =
                    await Promise.all([
                        axiosInstance.get('api/candidates/'),
                        axiosInstance.get('api/companies/'),
                        axiosInstance.get('api/jobs/'),
                        axiosInstance.get('api/top-jobs/'),
                    ]);

                const sortedCandidates = (candidateResponse.data || []).sort((a, b) => a.id - b.id);
                const sortedCompanies = (companyResponse.data || []).sort((a, b) => a.id - b.id);
                const sortedJobs = (jobResponse.data || []).sort((a, b) => a.id - b.id);

                setCandidates(sortedCandidates);
                setCompanies(sortedCompanies);
                setJobs(sortedJobs);

                const topJobs = topJobResponse.data;

                const labels = topJobs.map((job) => job.title);
                const data = topJobs.map((job) => job.num_applications);

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
                console.error('Error fetching system data', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchSystemData();
    }, []);

    const handlePageChange = (type, page) => {
        switch (type) {
            case 'candidate':
                setCandidatePage(page);
                break;
            case 'company':
                setCompanyPage(page);
                break;
            case 'job':
                setJobPage(page);
                break;
            default:
                break;
        }
    };

    const paginate = (data, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
            <div className="container mx-auto py-4">
                <h1 className="text-3xl font-bold mb-4">Administrator Dashboard</h1>
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${
                            selectedSection === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
                        onClick={() => setSelectedSection('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            selectedSection === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
                        onClick={() => setSelectedSection('users')}
                    >
                        Manage Candidates
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            selectedSection === 'companies' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
                        onClick={() => setSelectedSection('companies')}
                    >
                        Manage Companies
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                            selectedSection === 'jobs' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                        }`}
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
                        <h2 className="text-2xl font-bold mb-4">Manage Candidates</h2>
                        <CandidateList candidates={paginate(candidates, candidatePage)}/>
                        <Pagination
                            totalItems={candidates.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={candidatePage}
                            onPageChange={(page) => handlePageChange('candidate', page)}
                        />
                    </div>
                )}

                {selectedSection === 'companies' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Companies</h2>
                        <CompanyList companies={paginate(companies, companyPage)}/>
                        <Pagination
                            totalItems={companies.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={companyPage}
                            onPageChange={(page) => handlePageChange('company', page)}
                        />
                    </div>
                )}

                {selectedSection === 'jobs' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
                        <JobList jobs={paginate(jobs, jobPage)}/>
                        <Pagination
                            totalItems={jobs.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={jobPage}
                            onPageChange={(page) => handlePageChange('job', page)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdministratorDashboard;
