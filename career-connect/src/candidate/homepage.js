import React, {useState} from 'react';
import Navbar from '../components/navbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

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
        <div className="container bg-gray-200 min-h-screen w-screen">
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

const JobCard = ({logo, title, company, salary, location, description, skills, timePosted}) => {
    return (
        <div className="border border-white shadow-md rounded-md p-4 bg-white my-2">
            <div className="flex items-center mb-4">
                <img src={logo} alt={`${company} Logo`} className="w-40 h-24 mr-4 border border-gray-200 shadow-md rounded-md"/>
                <div>
                    <h3 className="text-red-600 font-bold">{title}</h3>
                    <p className="text-gray-700">{company}</p>
                    <p className="text-red-500">{salary}</p>
                    <p className="text-gray-500">{location}</p>
                    <div className="mb-4">
                        <p className="text-gray-700">
                            <ul className="list-disc ml-6">
                                {description.map((desc, index) => (
                                    <li key={index}>{desc}</li>
                                ))}
                            </ul>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{skill}</span>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-4">{timePosted}</p>
                </div>
            </div>
        </div>
    );
};

export default CandidateHomepage;
