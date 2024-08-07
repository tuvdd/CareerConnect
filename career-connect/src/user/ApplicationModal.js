import React from 'react';
import axiosInstance from "../AxiosConfig";

const ApplicationModal = ({isOpen, onClose, application}) => {
    if (!isOpen) return null;

    const onViewProfile = () => {
        return window.open(`/candidate-profile/${application.candidate.id}`, '_blank', 'noopener noreferrer');
    }

    const onViewResume = async () => {
        if (application.status !== 'Rejected') {
            await axiosInstance.patch(`/api/applications/${application.id}/`, {
                status: 'Viewed Resume'
            })
        }
        return window.open(application.resume, '_blank', 'noopener noreferrer');
    }

    const onReject = async () => {
        await axiosInstance.patch(`/api/applications/${application.id}/`, {
            status: 'Rejected'
        }).then(onClose())
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Ứng viên: {application.candidate.firstname} {application.candidate.lastname}</h2>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={onViewProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Xem profile
                    </button>
                    <button
                        onClick={onViewResume}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Xem resume ứng tuyển
                    </button>
                    <button
                        onClick={onReject}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Từ chối
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;
