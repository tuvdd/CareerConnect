import React, {useEffect, useState} from 'react';
import Navbar from '../components/navbar';
import {Link, useNavigate, useParams} from "react-router-dom";
import axiosInstance from "../AxiosConfig";
import LoadingSpinner from "../components/Loading";
import {faBuilding, faChevronLeft, faChevronRight, faLocationDot, faWallet} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NotificationPopup from "../components/NotificationPopup";

const AppliedJob = () => {
    const {candidateId} = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [notification, setNotification] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const [currentUserResponse, candidateResponse] = await Promise.all([
                    axiosInstance.get('api/user/'),
                    axiosInstance.get(`api/candidates/${candidateId}`),
                ]);

                if (currentUserResponse.data.id !== candidateResponse.data.user.id) {
                    return navigate('/home');
                }

                const response = await axiosInstance.get(`api/candidates/${candidateId}/applications/`, {
                    params: { page: currentPage }
                });
                setApplications(response.data.results);
                setTotalPages(Math.ceil(response.data.count / 5));
            } catch (err) {
                setError(true);
                setNotification(err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [candidateId, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getPaginationItems = () => {
        const paginationItems = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                paginationItems.push(i);
            }
        } else {
            if (currentPage > 1) {
                paginationItems.push(currentPage - 1);
            }
            paginationItems.push(currentPage);
            if (currentPage < totalPages) {
                paginationItems.push(currentPage + 1);
            }
        }
        return paginationItems;
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="container min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
            <div className="container bg-gray-100 min-h-screen max-w-screen-2xl flex justify-center">
                <div className="container w-3/5 h-fit flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold my-6">Danh sách việc làm đã ứng tuyển</h1>
                    {applications.map((application) => (
                        <Link to={`/jobs/${application.job.id}`} className="no-underline">
                            <div
                                key={application.job.id}
                                className={`w-full ${application.job.status === "Closed" ? "bg-gray-300" : "bg-white"} p-4 my-2 border shadow-md rounded-lg grid grid-cols-12 gap-4`}
                            >
                                <div className="col-span-2 flex items-center justify-center">
                                    <img
                                        src={application.job.company.logo}
                                        alt="company logo"
                                        className="w-24 h-24 object-contain"
                                    />
                                </div>
                                <div className="col-span-8">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {application.job.title}
                                    </h2>
                                    <p className="text-gray-600">
                                        <FontAwesomeIcon icon={faBuilding} className="mr-2 w-4 h-4"/>
                                        {application.job.company.name}
                                    </p>
                                    <p className="text-gray-600">
                                        <FontAwesomeIcon icon={faLocationDot} className="mr-2 w-4 h-4"/>
                                        {application.job.location}
                                    </p>
                                    <p className="text-gray-600">
                                        <FontAwesomeIcon icon={faWallet} className="mr-2 w-4 h-4"/>
                                        {application.job.salary}
                                    </p>
                                    <p
                                        className="text-gray-600 text-sm overflow-hidden custom-html-content"
                                        style={{
                                            maxHeight: "4em",
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                        }}
                                        dangerouslySetInnerHTML={{__html: application.job.description}}
                                    />
                                </div>
                                <div className="col-span-2 text-right flex flex-col justify-between">
                                    <p className="text-gray-500">Ứng tuyển ngày: {application.date}</p>
                                    <p className="text-red-500 font-bold">Trạng thái: {application.status}</p>
                                </div>
                            </div>
                        </Link>
                    ))}

                    <div className="flex justify-center w-full my-6">
                        <ul className="flex space-x-2">
                            <li>
                                <button
                                    disabled={currentPage <= 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4"/>
                                </button>
                            </li>
                            {currentPage > 2 && (
                                <>
                                    <li>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                                        >
                                            1
                                        </button>
                                    </li>
                                    {currentPage > 3 && <li className="px-3 py-1">...</li>}
                                </>
                            )}
                            {getPaginationItems().map((page) => (
                                <li key={page}>
                                    <button
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            {currentPage < totalPages - 1 && (
                                <>
                                    {currentPage < totalPages - 2 && <li className="px-3 py-1">...</li>}
                                    <li>
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                                        >
                                            {totalPages}
                                        </button>
                                    </li>
                                </>
                            )}
                            <li>
                                <button
                                    disabled={currentPage >= totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
        </div>
    );
};

export default AppliedJob;
