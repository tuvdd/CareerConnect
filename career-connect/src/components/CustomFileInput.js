import React, {useRef, useState} from "react";

const CustomFileInput = ({onChange, text, accept}) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onChange(e);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{display: 'none'}}
                accept={accept}
            />
            <button
                type="button"
                onClick={handleClick}
                className="w-40 bg-green-500 text-white font-bold p-2 rounded mt-2"
            >
                {text}
            </button>
            {fileName && (
                <p className="mt-2 text-gray-700">Selected file: {fileName}</p>
            )}
        </div>
    );
};

export default CustomFileInput;