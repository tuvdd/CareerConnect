import React, { useState } from 'react';


const Register = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    industry: '',
    headquarters: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [selectedOption, setSelectedOption] = useState('candidate'); // state để lưu trạng thái lựa chọn, mặc định là 'candidate'

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Data:", loginForm);
    // Add logic to handle login here
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    console.log("Register Form Data:", registerForm);
    // Add logic to handle registration here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option); // cập nhật trạng thái lựa chọn khi người dùng click vào ứng viên hoặc nhà tuyển dụng
    // Reset form fields when switching options
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      industry: '',
      headquarters: '',
    });
  };

  return (
    <div>
    <div className='h-20 shadow-lg flex items-center justify-center bg-white'>
        <div className='text-red-600 text-4xl'>
            CAREER CONNECT
        </div>

    </div>
    <div className='h-12 bg-slate-800'>
        <div className='flex justify-evenly h-full pt-2 '>
            <div className='text-slate-100 text-xl '>Việc làm IT</div>
            <div className='text-slate-100 text-xl'>Tạo CV</div>
            <div className='text-slate-100 text-xl'>Công ty IT</div>
        </div>
    </div>
    <div className="flex justify-center">
      {/* Đăng nhập */}
      <div className="w-1/2 h-auto p-8 bg-colorpink flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-4 text-center">Đăng nhập</h2>
        <div className="m-20 bg-white h-auto">
          <form onSubmit={handleLoginSubmit} className="space-y-4 m-4">
            <div className="pt-4">
              <label htmlFor="email" className="block mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block mb-1">
                Mật khẩu
              </label>
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
        <h2 className="text-4xl font-bold mt-5  text-center">Đăng ký</h2>
        <div className="mx-20 mb-20 mt-10 bg-white h-auto">
          <div className='flex justify-around pb-5 mb-5 border-b-2 border-black '>
              <div className={`text-2xl cursor-pointer ${selectedOption === 'candidate' ? 'font-bold' : ''}`} onClick={() => handleOptionClick('candidate')}>Ứng viên </div>
              <div className={`text-2xl cursor-pointer ${selectedOption === 'employer' ? 'font-bold' : ''}`} onClick={() => handleOptionClick('employer')}>Nhà tuyển dụng</div>
          </div>
          {selectedOption === 'candidate' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerForm.firstName}
                    onChange={handleRegisterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerForm.lastName}
                    onChange={handleRegisterChange}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block mb-1">
                  Ngày tháng năm sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={registerForm.dateOfBirth}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block mb-1">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={registerForm.gender}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className='w-full'>
              <button
                type="submit"
                className="bg-white-500 border-2 border-gray-300 text-black px-4 py-2 rounded hover:bg-red-600 w-full"
              >
                Đăng ký
              </button>
              </div>
            </form>
          ) : selectedOption === 'employer' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1">
                  Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="companyName" className="block mb-1">
                  Tên công ty
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={registerForm.companyName}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block mb-1">
                  Lĩnh vực
                </label>
                <input
                  type="text"
                  name="industry"
                  value={registerForm.industry}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <label htmlFor="headquarters" className="block mb-1">
                  Trụ sở chính
                </label>
                <input
                  type="text"
                  name="headquarters"
                  value={registerForm.headquarters}
                  onChange={handleRegisterChange}
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                />
              </div>
              <div className='w-full'>
              <button
                type="submit"
                className="bg-white-500 border-2 border-gray-300 text-black px-4 py-2 rounded hover:bg-red-600 w-full"
              >
                Đăng ký
              </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Register;
