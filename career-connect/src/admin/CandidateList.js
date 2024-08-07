import React from 'react';
import AdminButtons from "../components/AdminButtons";

const CandidateList = ({candidates}) => {
    const handleResumeSelect = (e) => {
        const url = e.target.value;
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleCandidateClick = (candidateId) => {
        window.open(`/candidate-profile/${candidateId}`, '_blank');
    }

    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Candidate List</h3>
            <p className="text-sm mb-4">{candidates.length} Candidates</p>
            <table className="w-full text-left">
                <thead>
                <tr>
                    <th className="border-b py-2 px-4">ID</th>
                    <th className="border-b py-2 px-4">Name</th>
                    <th className="border-b py-2 px-4">Gender</th>
                    <th className="border-b py-2 px-4">Birthday</th>
                    <th className="border-b py-2 px-4">Address</th>
                    <th className="border-b py-2 px-4">Resumes</th>
                    <th className="border-b py-2 px-4">Status</th>
                    <th className="border-b py-2 px-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((candidate) => (
                    <tr key={candidate.id} className={`${candidate.status === 'Activated' ? 'bg-white' : 'bg-gray-200'}`}>
                        <td className="border-b py-2 px-4">{candidate.id}</td>
                        <td className="border-b py-2 px-4 hover:cursor-pointer underline text-blue-400"
                            onClick={() => handleCandidateClick(candidate.id)}
                        >
                            {candidate.firstname} {candidate.lastname}
                        </td>
                        <td className="border-b py-2 px-4">{candidate.gender}</td>
                        <td className="border-b py-2 px-4">{new Date(candidate.birthday).toLocaleDateString()}</td>
                        <td className="border-b py-2 px-4">{candidate.address}</td>
                        <td className="border-b py-2 px-4">
                            {candidate.resumes && candidate.resumes.length > 0 ? (
                                <select
                                    onChange={handleResumeSelect}
                                    className="bg-white border rounded p-2"
                                >
                                    <option value="">Have {candidate.resumes.length} resumes</option>
                                    {candidate.resumes.map((resume, index) => (
                                        <option key={index} value={resume}>
                                            Resume {index + 1}
                                        </option>
                                    ))}
                                </select>
                            ) : 'None'}
                        </td>
                        <td className="border-b py-2 px-4">{candidate.status}</td>
                        <td className="border-b py-2 px-4"><AdminButtons object={candidate} type={'candidates'}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CandidateList;
