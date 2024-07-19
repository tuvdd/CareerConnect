import React, {useState} from "react";
import Navbar from "../components/navbar";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faLocationDot} from '@fortawesome/free-solid-svg-icons'
import CreateJobForm from "../components/CreateJobForm";
import JobCard from "../components/JobCard";

const CompanyHomepage = () => {
    const jobData = {
        logo: '/path/to/logo.png',
        title: 'Thực tập sinh Backend',
        company: 'PTIT',
        salary: 'Đăng nhập để xem mức lương',
        location: 'Quận Hà Đông, Hà Nội',
        description: [
            'Lương tháng 13 (Trung bình 4-5 tháng lương cơ bản)',
            'Được hưởng lương, thưởng và các cơ chế khuyến khích theo thỏa thuận và...',
            'Được chi bổ sung thu nhập theo kết quả làm việc, vị trí công việc và theo q...',
        ],
        skills: ['Java', 'Python', '.NET', 'Fintech', 'Cloud'],
        timePosted: 'Đăng 39 phút trước',
    };
    const [selectedOption, setSelectedOption] = useState('createJob');

    function handleOptionClick(option) {
        setSelectedOption(option)
    }

    return (
        <div className="container bg-gray-100 min-h-screen w-screen pt-20">
            <Navbar/>
            <div className="container w-full h-60 bg-pink-200 flex flex-col items-center justify-center p-4">
                <div className="flex w-full justify-center">
                    <img src="" alt="Company Logo"
                         className="w-52 h-36 mr-10 border border-gray-200 shadow-md rounded-md"/>
                    <div className="leading-9">
                        <h1 className="text-2xl font-bold">Company Name</h1>
                        <span className="flex items-center">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-2"/>
                            <p>Company Location</p>
                        </span>
                        <p>Company Description</p>
                    </div>
                </div>
            </div>
            <div className="container w-full h-fit flex flex-col items-center justify-center">
                <div className='w-full flex justify-center mb-5 bg-white'>
                    <button
                        className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'createJob' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                        onClick={() => handleOptionClick('createJob')}>Thêm công việc
                    </button>
                    <button
                        className={`text-2xl cursor-pointer p-5 border-b border-black ${selectedOption === 'viewJobs' ? 'font-bold text-red-500 border-b-2 border-red-500' : ''}`}
                        onClick={() => handleOptionClick('viewJobs')}>Công việc đã tạo
                    </button>
                </div>
                {selectedOption === 'createJob' && (
                    <CreateJobForm/>
                )}
                {selectedOption === 'viewJobs' && (
                    <JobCard {...jobData} />
                )}
            </div>
        </div>
    )
}

export default CompanyHomepage;