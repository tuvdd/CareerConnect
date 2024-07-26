import React from 'react';

const ConfirmationPopup = ({ show, onClose, onConfirm, title, message, resumeLink }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4 whitespace-pre-line custom-html-content" dangerouslySetInnerHTML={{__html: message}}></p>
                {resumeLink && (
                    <a
                        href={resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
                    >
                        View Resume
                    </a>
                )}
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
