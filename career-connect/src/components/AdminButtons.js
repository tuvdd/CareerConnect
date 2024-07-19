import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmationPopup from './ConfirmationPopup';

const AdminButtons = () => {
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [confirmAction, setConfirmAction] = useState('');

    const handleButtonClick = (action) => {
        setConfirmAction(action);
        setShowConfirmPopup(true);
    };

    const handleConfirm = () => {
        setShowConfirmPopup(false);
    };

    const handleClose = () => {
        setShowConfirmPopup(false);
    };

    return (
        <div className="flex space-x-2">
            <button className="py-2 px-1" onClick={() => handleButtonClick('hide')}><FontAwesomeIcon icon={faEyeSlash} /></button>
            <button className="py-2 px-1" onClick={() => handleButtonClick('edit')}><FontAwesomeIcon icon={faPen} /></button>
            <button className="py-2 px-1" onClick={() => handleButtonClick('delete')}><FontAwesomeIcon icon={faTrashCan} /></button>

            <ConfirmationPopup
                show={showConfirmPopup}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={`Confirm ${confirmAction}`}
                message={`Are you sure you want to ${confirmAction} this item?`}
            />
        </div>
    );
}

export default AdminButtons;
