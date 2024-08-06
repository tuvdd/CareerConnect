import React, { useEffect, useState } from 'react';
import JobCard from "../components/JobCard";
import InfiniteScroll from "react-infinite-scroll-component";

const ViewJobs = ({ company, jobs }) => {
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        setHasMore(jobs.length > pageSize);
    }, []);

    useEffect(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setHasMore(end < jobs.length);
    }, [page, jobs]);

    return (
        <div className="container w-full h-fit flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold my-6">Công việc đã tạo</h1>
            <InfiniteScroll
                dataLength={jobs.length}
                next={() => setPage(prevPage => prevPage + 1)}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p className="text-center">No more jobs</p>}
            >
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        company={company}
                        salary={job.salary}
                        location={job.location}
                        description={job.description}
                        timePosted={job.post_date}
                        status={job.status}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default ViewJobs;
