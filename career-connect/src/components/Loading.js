import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
            <div className="flex flex-col justify-center items-center">
                <img src="/loading.gif" alt="Loading..." className="w-20 h-20" />
                <h1 className="text-2xl font-bold mt-4">Loading...</h1>
            </div>
        </div>
    );
};

export default LoadingSpinner;
