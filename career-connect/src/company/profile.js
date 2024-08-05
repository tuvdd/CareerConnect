import React, {useEffect, useState} from "react";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import CreateJobForm from "./CreateJobForm";
import AboutCompany from "./AboutCompany";
import NotificationPopup from "../components/NotificationPopup";
import LoadingSpinner from "../components/Loading";
import ViewJobs from "./ViewJobs";
import {useParams} from "react-router-dom";
import axiosInstance from "../AxiosConfig";

const CompanyProfile = () => {
    const { companyId } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [ jobs, setJobs ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOption, setSelectedOption] = useState('aboutCompany');
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const [currentUserResponse, companyResponse, jobsResponse] = await Promise.all([
                    axiosInstance.get('api/user/'),
                    axiosInstance.get(`api/companies/${companyId}`),
                    axiosInstance.get(`api/companies/${companyId}/jobs/`)
                ]);

                setCurrentUser(currentUserResponse.data);
                setCompany(companyResponse.data);
                setJobs(jobsResponse.data);
            } catch (error) {
                console.error("Error fetching user or company details", error);
                setNotification('Error fetching data');
                setError('true');
            } finally {
                setLoading(false);
            }
        };

        const resetData = () => {
            setCompany(null);
            setJobs([]);
            setSelectedOption('aboutCompany');
        }

        resetData();
        fetchCompanyData();
    }, [companyId]);

    const isOwner = currentUser && company && currentUser.id === company.user.id;

    function handleOptionClick(option) {
        setSelectedOption(option);
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl pt-20 ">
            <Navbar />
            <div className="container bg-gray-100">
                <div className="container w-full h-60 lg:bg-[url('https://c.topdevvn.com/v4/assets/images/bg-search.jpg')] flex flex-col items-center justify-center p-4">
                    <div className="flex w-full justify-center items-center">
                        <img src={company?.logo} alt="Company Logo"
                            className="w-40 h-40 mr-10 border border-gray-200 shadow-lg rounded-md" />
                        <div className="leading-9">
                            <h1 className="text-2xl font-bold">{company?.name}</h1>
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-4 h-4" />
                                <p>{company?.address}</p>
                            </span>
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 w-4 h-4" />
                                <p>{company?.phone}</p>
                            </span>
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4 h-4" />
                                <p>{company?.user.email}</p>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="container w-full h-fit flex flex-col items-center justify-center">
                    <div className='w-full flex justify-center mb-5 bg-white'>
                        <button
                            className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'aboutCompany' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                            onClick={() => handleOptionClick('aboutCompany')}>Giới thiệu
                        </button>
                        {isOwner && (
                            <button
                                className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'createJob' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                                onClick={() => handleOptionClick('createJob')}>Thêm công việc
                            </button>
                        )}
                        <button
                            className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'viewJobs' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                            onClick={() => handleOptionClick('viewJobs')}>Công việc đã tạo
                        </button>
                    </div>
                    {selectedOption === 'aboutCompany' && company && (
                        <AboutCompany company={company} isOwner={isOwner}/>
                    )}
                    {selectedOption === 'createJob' && company && isOwner && (
                        <CreateJobForm company={company}/>
                    )}
                    {selectedOption === 'viewJobs' && company && (
                        <ViewJobs company={company} jobs={jobs}/>
                    )}
                </div>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')} />
        </div>
    );
}

export default CompanyProfile;