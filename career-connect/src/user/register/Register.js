import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import NotificationPopup from "../../components/NotificationPopup";
import LoadingSpinner from "../../components/Loading";
import {useAuth} from "../../App";

const Register = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated, setRole } = useAuth();
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const [registerCandidateForm, setRegisterCandidateForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthday: '',
        gender: ''
    });

    const [registerCompanyForm, setRegisterCompanyForm] = useState({
        email: '',
        name: '',
        address: '',
        field: '',
        phone: '',
        description: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [selectedOption, setSelectedOption] = useState('candidate');
    const [notification, setNotification] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value,
        });
    };

    const handleCandidateRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterCandidateForm({
            ...registerCandidateForm,
            [name]: value,
        });
    };

    const handleCompanyRegisterChange = (e) => {
        const {name, value} = e.target;
        setRegisterCompanyForm({
            ...registerCompanyForm,
            [name]: value,
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', loginForm);
            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('role', response.data.redirect_url);
            setIsAuthenticated(true);
            setRole(response.data.redirect_url);
            navigate("/home");
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            if (error.response.data.error) {
                setNotification(error.response.data.error);
            } else {
                setNotification('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            }
            setError('true');
        } finally {
            setLoading(false)
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let apiUrl;
        let registerForm;
        if (selectedOption === 'candidate') {
            if (registerCandidateForm.password !== registerCandidateForm.confirmPassword) {
                setNotification('Mật khẩu và xác nhận mật khẩu không khớp!');
                setError('true');
                return;
            }
            apiUrl = 'http://127.0.0.1:8000/api/candidate/register/';
            registerForm = registerCandidateForm;
        }
        else {
            if (registerCompanyForm.password !== registerCompanyForm.confirmPassword) {
                setNotification('Mật khẩu và xác nhận mật khẩu không khớp!');
                setError('true');
                return;
            }
            apiUrl = 'http://127.0.0.1:8000/api/company/register/';
            registerForm = registerCompanyForm;
        }

        try {
            const response = await axios.post(apiUrl, registerForm);
            console.log('Registration successful:', response.data);
            setNotification('Đăng ký thành công');
            setError('none');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            setNotification('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
            setError('true');
        } finally {
            setLoading(false)
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setRegisterCompanyForm({
            email: '',
            name: '',
            address: '',
            field: '',
            phone: '',
            description: '',
            password: '',
            confirmPassword: '',
        });
        setRegisterCandidateForm({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirmPassword: '',
            birthday: '',
            gender: ''
        })
    };

    return (
        <div>
            {loading && <LoadingSpinner />}
            <div className="flex justify-center">
                {/* Đăng nhập */}
                <div className="w-1/2 h-auto p-8 bg-login flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-center">Đăng nhập</h2>
                    <div className="m-20 bg-white h-auto rounded shadow-md p-6">
                        <form onSubmit={handleLoginSubmit} className="space-y-4 m-4">
                            <div className="pt-4">
                                <label htmlFor="email" className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={loginForm.email}
                                    onChange={handleLoginChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full"
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-1">Mật khẩu</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 mt-10 mr-3 text-sm text-gray-500 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-red-500 min-w-full text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <div className="text-sm cursor-pointer text-gray-500 hover:text-blue-500">
                                    Quên mật khẩu?
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Đăng ký */}
                <div className="w-1/2 h-auto p-8 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mt-5 text-center">Đăng ký</h2>
                    <div className="mx-20 mb-20 mt-10 bg-white h-auto">
                        <div className='flex justify-around pb-5 mb-5 border-b-2 border-black '>
                            <div
                                className={`text-2xl cursor-pointer ${selectedOption === 'candidate' ? 'font-bold' : ''}`}
                                onClick={() => handleOptionClick('candidate')}>Ứng viên
                            </div>
                            <div
                                className={`text-2xl cursor-pointer ${selectedOption === 'employer' ? 'font-bold' : ''}`}
                                onClick={() => handleOptionClick('employer')}>Nhà tuyển dụng
                            </div>
                        </div>
                        {selectedOption === 'candidate' ? (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstname" className="block mb-1">Họ</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={registerCandidateForm.firstname}
                                            onChange={handleCandidateRegisterChange}
                                            className="border border-gray-300 rounded px-3 py-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastname" className="block mb-1">Tên</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={registerCandidateForm.lastname}
                                            onChange={handleCandidateRegisterChange}
                                            className="border border-gray-300 rounded px-3 py-2 w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerCandidateForm.email}
                                        onChange={handleCandidateRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-1">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={registerCandidateForm.password}
                                        onChange={handleCandidateRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-1">Nhập lại mật khẩu</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerCandidateForm.confirmPassword}
                                        onChange={handleCandidateRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="birthday" className="block mb-1">Ngày tháng năm sinh</label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={registerCandidateForm.birthday}
                                        onChange={handleCandidateRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block mb-1">Giới tính</label>
                                    <select
                                        name="gender"
                                        value={registerCandidateForm.gender}
                                        onChange={handleCandidateRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Male">Nam</option>
                                        <option value="Female">Nữ</option>
                                        <option value="Other">Khác</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Đăng ký
                                </button>
                            </form>
                        ) : selectedOption === 'employer' ? (
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={registerCompanyForm.email}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-1">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={registerCompanyForm.password}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-1">Nhập lại mật khẩu</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerCompanyForm.confirmPassword}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="name" className="block mb-1">Tên công ty</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerCompanyForm.name}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="field" className="block mb-1">Lĩnh vực</label>
                                    <input
                                        type="text"
                                        name="field"
                                        value={registerCompanyForm.field}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-1">Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={registerCompanyForm.address}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mb-1">Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={registerCompanyForm.description}
                                        onChange={handleCompanyRegisterChange}
                                        className="border border-gray-300 rounded px-3 py-2 w-full"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Đăng ký
                                </button>
                            </form>
                        ) : null}
                        <NotificationPopup error={error} message={notification} onClose={() => setNotification('')}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
