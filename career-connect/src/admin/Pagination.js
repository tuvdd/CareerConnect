import React from 'react';

const Pagination = ({totalItems, itemsPerPage, currentPage, onPageChange}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex justify-center my-4">
            {Array.from({length: totalPages}, (_, index) => index + 1).map((page) => (
                <button
                    key={page}
                    className={`mx-1 px-3 py-1 rounded ${
                        page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
