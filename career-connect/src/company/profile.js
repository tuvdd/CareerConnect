import React, {useEffect, useState} from "react";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import CreateJobForm from "./CreateJobForm";
import JobCard from "../components/JobCard";
import AboutCompany from "./AboutCompany";
import NotificationPopup from "../components/NotificationPopup";
import LoadingSpinner from "../components/Loading";
import useCompanyData from './CompanyData';
import ViewJobs from "./ViewJobs";

const CompanyProfile = () => {
    const { user, company, loading, error } = useCompanyData();
    const [selectedOption, setSelectedOption] = useState('aboutCompany');
    const [notification, setNotification] = useState('');

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
                                <p>{user?.email}</p>
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
                        <button
                            className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'createJob' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                            onClick={() => handleOptionClick('createJob')}>Thêm công việc
                        </button>
                        <button
                            className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'viewJobs' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                            onClick={() => handleOptionClick('viewJobs')}>Công việc đã tạo
                        </button>
                    </div>
                    {selectedOption === 'aboutCompany' && company && user && (
                        <AboutCompany company={company} user={user}/>
                    )}
                    {selectedOption === 'createJob' && company && (
                        <CreateJobForm company={company}/>
                    )}
                    {selectedOption === 'viewJobs' && company && (
                        <ViewJobs company={company}/>
                    )}
                </div>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')} />
        </div>
    );
}

export default CompanyProfile;