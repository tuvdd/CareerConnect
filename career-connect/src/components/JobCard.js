import React, { useEffect, useState } from "react";
import axiosInstance from "../AxiosConfig";
import { Link } from 'react-router-dom';
import LoadingSpinner from "./Loading";
import {formatDistanceToNow, parseISO} from "date-fns";
import {vi} from "date-fns/locale";

const JobCard = ({ id, title, company, salary, location, description, timePosted, status }) => {
    const [companyData, setCompanyData] = useState(null);
    const [sanitizedHtml, setSanitizedHtml] = useState(description || "");
    const [loading, setLoading] = useState(true);

    const timeAgo = formatDistanceToNow(parseISO(timePosted), { addSuffix: true, locale: vi });

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const companyResponse = await axiosInstance.get(`api/companies/${company}/`);
                setCompanyData(companyResponse.data);
            } catch (error) {
                console.error("Error fetching company details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [company]);

    if (loading) return <LoadingSpinner />;

    return (
        <Link to={`/jobs/${id}`} className="no-underline">
            <div
                className={`border border-white shadow-md rounded-md p-4 my-2 max-w-2xl overflow-hidden ${status === 'Closed' ? 'bg-gray-300' : 'bg-white'}`}
            >
                <div className="flex items-center mb-4 space-x-4">
                    <div className="w-1/3 flex items-center justify-center">
                        <img
                            src={companyData?.logo || "default-logo.png"}
                            alt={`${companyData?.name || "Company"} Logo`}
                            className="w-3/5 h-fit object-cover mr-4 border border-gray-200 shadow-md rounded-md"
                        />
                    </div>
                    <div className="w-2/3">
                        <div className="flex-1">
                            <h3 className="text-red-600 font-bold text-xl truncate">{title}</h3>
                            <p className="text-gray-700 text-md truncate">{companyData?.name || "Unknown Company"}</p>
                            <p className="text-red-500 text-md">{salary}</p>
                            <p className="text-gray-500 text-md">{location}</p>
                            <p className="text-gray-400 text-sm mt-4 truncate overflow-hidden custom-html-content" style={{
                                maxHeight: '4em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                            <p className="text-gray-400 text-sm mt-4">{timeAgo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default JobCard;