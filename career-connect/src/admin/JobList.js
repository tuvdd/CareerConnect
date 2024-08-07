import AdminButtons from "../components/AdminButtons";
import React from "react";

const JobList = ({jobs = []}) => {
    const handleGoToJobDetail = (jobId) => {
        window.open(`/jobs/${jobId}`, '_blank');
    }

    const handleGoToCompanyProfile = (companyId) => {
        window.open(`/company-profile/${companyId}`, '_blank');
    }

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Job Management</h3>
            <p className="text-sm mb-4">{jobs.length} Jobs</p>
            <table className="w-full text-left">
                <thead>
                <tr>
                    <th className="border-b py-2 px-4">ID</th>
                    <th className="border-b py-2 px-4">Title</th>
                    <th className="border-b py-2 px-4">Company</th>
                    <th className="border-b py-2 px-4">Salary</th>
                    <th className="border-b py-2 px-4">Location</th>
                    <th className="border-b py-2 px-4">Status</th>
                    <th className="border-b py-2 px-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                {jobs.map((job) => (
                    <tr key={job.id} className={`${job.status === 'Activated' ? 'bg-white' : 'bg-gray-200'}`}>
                        <td className="border-b py-2 px-4">{job.id}</td>
                        <td className="border-b py-2 px-4 hover:cursor-pointer underline text-blue-400"
                            onClick={() => handleGoToJobDetail(job.id)}
                        >
                            {job.title}
                        </td>
                        <td className="border-b py-2 px-4 hover:cursor-pointer underline text-blue-400"
                            onClick={() => handleGoToCompanyProfile(job.company.id)}
                        >
                            {job.company?.name || 'N/A'}
                        </td>
                        <td className="border-b py-2 px-4">{job.salary}</td>
                        <td className="border-b py-2 px-4">{job.location}</td>
                        <td className="border-b py-2 px-4">{job.status}</td>
                        <td className="border-b py-2 px-4"><AdminButtons object={job} type={'jobs'}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobList;