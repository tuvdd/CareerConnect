import React, {useState} from 'react';
import Navbar from '../components/navbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import JobCard from "../components/JobCard";

const CandidateHomepage = () => {
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
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="container bg-gray-100 min-h-screen w-screen pt-20">
            <Navbar/>
            <div className="container w-full h-60 bg-pink-200 flex flex-col items-center justify-center p-4">
                <div className="w-4/5">
                    <h1 className="text-3xl font-bold mb-4">Tìm kiếm</h1>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="w-full flex items-center rounded bg-white p-3"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty,..."
                            className="flex-grow p-2 focus:outline-none"
                        />
                        <button type="submit"
                                className="ml-2 bg-red-500 text-white font-bold rounded-md p-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2"/>
                            Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>
            <div className="container w-full h-fit flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold my-6">Danh sách việc làm</h1>
                <JobCard {...jobData}/>
                <JobCard {...jobData}/>
                <JobCard {...jobData}/>
            </div>
        </div>
    );
};

export default CandidateHomepage;
