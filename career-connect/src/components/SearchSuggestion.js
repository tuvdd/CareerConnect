import React from 'react';

const SearchSuggestion = ({ suggestions, onSelectSuggestion, onMouseDown, onMouseUp }) => {
    return (
        <ul className="absolute bg-white shadow-md mt-1 rounded w-full">
            {suggestions.map((suggestion, index) => (
                <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onClick={() => onSelectSuggestion(suggestion)}
                >
                    {suggestion}
                </li>
            ))}
        </ul>
    );
};

export default SearchSuggestion;
