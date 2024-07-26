import React, {useEffect, useState} from 'react';
import Navbar from '../components/navbar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import JobCard from '../components/JobCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import axiosInstance from '../AxiosConfig';
import LoadingSpinner from "../components/Loading";

const Homepage = () => {
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const pageSize = 5;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get(`api/jobs/`);
                const allJobs = response.data;
                setJobs(allJobs);
                setDisplayedJobs(allJobs.slice(0, pageSize));
                setHasMore(allJobs.length > pageSize);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setDisplayedJobs(jobs.slice(start, end));
        setHasMore(end < jobs.length);
    }, [page, jobs]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) return <LoadingSpinner/>;

    return (
        <div className="container bg-gray-100 min-h-screen max-w-screen-2xl pt-20">
            <Navbar/>
            <div
                className="container w-full h-60 lg:bg-[url('https://c.topdevvn.com/v4/assets/images/bg-search.jpg')] flex flex-col items-center justify-center p-4">
                <div className="w-4/5">
                    <h1 className="text-3xl font-bold mb-4">Tìm kiếm</h1>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="w-full flex items-center rounded bg-white p-3 shadow-md"
                    >
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty,..."
                            className="flex-grow p-2 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="ml-2 bg-red-500 text-white font-bold rounded-md p-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2"/>
                            Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>
            <div className="container w-full h-fit flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold my-6">Danh sách việc làm</h1>
                <InfiniteScroll
                    dataLength={displayedJobs.length}
                    next={() => setPage(prevPage => prevPage + 1)}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p className="text-center">No more jobs</p>}
                >
                    {displayedJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            title={job.title}
                            company={job.company}
                            salary={job.salary}
                            location={job.location}
                            description={job.description}
                            timePosted={job.post_date}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default Homepage;
