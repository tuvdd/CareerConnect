import React, {useState} from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock, faTrashCan, faUnlock} from '@fortawesome/free-solid-svg-icons';
import ConfirmationPopup from './ConfirmationPopup';
import axiosInstance from "../AxiosConfig";
import {useNavigate} from "react-router-dom";

const AdminButtons = ({object, type}) => {
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [confirmAction, setConfirmAction] = useState('');
    const navigate = useNavigate();

    const handleButtonClick = (action) => {
        setConfirmAction(action);
        setShowConfirmPopup(true);
    };

    const updateJobsStatus = async () => {
        try {
            const jobsResponse = await axiosInstance.get(`/api/companies/${object.id}/jobs/`);
            const jobs = jobsResponse.data;

            for (const job of jobs) {
                if (confirmAction === 'lock') {
                    await axiosInstance.patch(`/api/jobs/${job.id}/`, {status: 'Locked'});
                } else if (confirmAction === 'unlock') {
                    await axiosInstance.patch(`/api/jobs/${job.id}/`, {status: 'Activated'});
                } else if (confirmAction === 'delete') {
                    await axiosInstance.delete(`/api/jobs/${job.id}/`);
                }
            }
        } catch (error) {
            console.error('Error updating jobs status:', error);
            alert("Không thành công khi cập nhật công việc. Vui lòng thử lại!");
        }
    };

    const handleConfirm = async () => {
        try {
            let response;
            if (confirmAction === 'lock') {
                response = await axiosInstance.patch(`/api/${type}/${object.id}/`, {status: 'Locked'});
                if (response.status === 200) {
                    alert("Khóa thành công!");
                    if (type === 'companies') {
                        await updateJobsStatus();
                    }
                    navigate(0);
                }
            } else if (confirmAction === 'unlock') {
                response = await axiosInstance.patch(`/api/${type}/${object.id}/`, {status: 'Activated'});
                if (response.status === 200) {
                    alert("Mở khóa thành công!");
                    if (type === 'companies') {
                        await updateJobsStatus();
                    }
                    navigate(0);
                }
            } else if (confirmAction === 'delete') {
                response = await axiosInstance.delete(`/api/${type}/${object.id}/`);
                if (response.status === 204) {
                    alert("Xóa thành công");
                    if (type === 'companies') {
                        await updateJobsStatus();
                    }
                    navigate(0);
                }
            }
        } catch (error) {
            console.error('API request error:', error);
            alert("Không thành công. Vui lòng thử lại!");
        } finally {
            setShowConfirmPopup(false);
        }
    };

    const handleClose = () => {
        setShowConfirmPopup(false);
    };

    return (
        <div className="flex space-x-2">
            {object.status === 'Locked' ? (
                <button className="py-2 px-1" onClick={() => handleButtonClick('unlock')}>
                    <FontAwesomeIcon icon={faUnlock}/>
                </button>
            ) : (
                <button className="py-2 px-1" onClick={() => handleButtonClick('lock')}>
                    <FontAwesomeIcon icon={faLock}/>
                </button>
            )}
            <button className="py-2 px-1" onClick={() => handleButtonClick('delete')}>
                <FontAwesomeIcon icon={faTrashCan}/>
            </button>

            <ConfirmationPopup
                show={showConfirmPopup}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={`Confirm ${confirmAction}`}
                message={`Are you sure you want to ${confirmAction} this item?`}
            />
        </div>
    );
};

export default AdminButtons;
