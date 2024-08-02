import React, { useState } from 'react';
import Navbar from '../components/navbar';

const AppliedJob = () => {
    const jobData = [
        {
            logo: '/path/to/logo1.png',
            company: 'PTIT',
            title: 'Thực tập sinh Backend',
            appliedDate: '01-08-2024',
            status: 'NTD đã xem',
            location: 'Quận Hà Đông, Hà Nội',
            salary: 'Đăng nhập để xem mức lương',
            description: [
                'Lương tháng 13 (Trung bình 4-5 tháng lương cơ bản)',
                'Được hưởng lương, thưởng và các cơ chế khuyến khích theo thỏa thuận và...',
                'Được chi bổ sung thu nhập theo kết quả làm việc, vị trí công việc và theo q...',
            ],
           
        },
        {
            logo: '/path/to/logo2.png',
            company: 'FPT',
            title: 'Kỹ sư phần mềm',
            appliedDate: '25-07-2024',
            status: 'Đã nộp CV',
            location: 'Cầu Giấy, Hà Nội',
            salary: '15-20 triệu/tháng',
            description: [
                'Môi trường làm việc năng động, sáng tạo',
                'Chế độ bảo hiểm đầy đủ',
                'Thưởng hiệu quả công việc',
            ],
            
        },
        {
            logo: '/path/to/logo3.png',
            company: 'VinGroup',
            title: 'Chuyên viên phân tích dữ liệu',
            appliedDate: '20-07-2024',
            status: 'NTD đã tải CV',
            location: 'Quận 1, TP. HCM',
            salary: '20-25 triệu/tháng',
            description: [
                'Phân tích dữ liệu, đưa ra báo cáo',
                'Làm việc với các đội ngũ kỹ thuật để triển khai giải pháp',
                'Đào tạo nhân viên mới',
            ],
           
        },
    ];

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search query:', searchQuery);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="container min-h-screen max-w-screen-2xl pt-20">
            <Navbar />

            <div className="container w-full h-fit flex flex-col justify-center items-center ml-52">
                <h1 className="text-3xl font-bold my-6">Danh sách việc làm đã ứng tuyển</h1>
                {jobData.map((job, index) => (
                    <div key={index} className="w-full bg-white p-4 my-2 border shadow-md rounded-lg flex justify-between items-start">
                        <div className="flex items-center">
                            <img src={job.logo} alt="company logo" className="w-16 h-16 mr-4"/>
                            <div>
                                <h2 className="text-xl font-semibold">{job.title}</h2>
                                <p className="text-gray-600">{job.company}</p>
                                <p className="text-gray-500">{job.location}</p>
                                <p className="text-gray-700">{job.salary}</p>
                                <ul className="mt-2">
                                    {job.description.map((desc, idx) => (
                                        <li key={idx} className="text-gray-600">{desc}</li>
                                    ))}
                                </ul>
                                
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">Ứng tuyển ngày: {job.appliedDate}</p>
                            <p className="text-red-500 font-bold">Trạng thái: {job.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppliedJob;
