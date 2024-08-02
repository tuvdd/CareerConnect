import { useState, useEffect } from 'react';
import axiosInstance from "../AxiosConfig";

const useCompanyData = () => {
    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const userResponse = await axiosInstance.get('api/user/');
                setUser(userResponse.data);

                if (userResponse.data.id) {
                    const companyResponse = await axiosInstance.get(`api/companies/?user=${userResponse.data.id}`);
                    setCompany(companyResponse.data[0]);
                }
            } catch (error) {
                console.error("Error fetching user or company details", error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    return { user, company, loading, error };
};

export default useCompanyData;
