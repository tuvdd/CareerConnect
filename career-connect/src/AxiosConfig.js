import axios from 'axios';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
    baseURL: REACT_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const response = await axiosInstance.post('/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('token', newAccessToken);
                    axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token failed', refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
