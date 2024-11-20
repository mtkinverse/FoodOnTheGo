import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';

const Register = () => {
  const host = 'http://localhost:8800';
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    phoneNo: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roleClicked, setRoleClicked] = useState(false);
  const [role, changeRole] = useState('customer');

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const sendVal = {
        name: values.firstname + " " + values.lastname,
        email: values.email,
        password: values.password,
        phoneNo: values.phoneNo,
        role: role
      }
      const res = await axios.post('/api/register', JSON.stringify(sendVal), {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-purple-600">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us to explore amazing food experiences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* First Name & Last Name */}
              <div>
                <label htmlFor="firstname" className="sr-only">First Name</label>
                <div className="relative">
                  <input
                    required
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={values.firstname}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="First Name"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
              <div>
                <label htmlFor="lastname" className="sr-only">Last Name</label>
                <div className="relative">
                  <input
                    required
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={values.lastname}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                    placeholder="Last Name"
                  />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNo" className="sr-only">Phone Number</label>
              <div className="relative">
                <input
                  required
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  value={values.phoneNo}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="+92 --- -------"
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <div className="relative">
                <input
                  required
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  required
                  id="password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            {/* Role Selection */}
            <div className="relative">
              <button
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm"
                onClick={e => { e.preventDefault(); setRoleClicked(prev => !prev) }}
              >
                <span>{role === 'customer' ? 'Select Role' : role}</span>
                <ChevronRight className={`transform transition-transform duration-200 ${roleClicked ? 'rotate-90' : ''}`} size={16} />
              </button>
              
              {roleClicked && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                  {[
                    { name: 'Customer', value: 'Customer' },
                    { name: 'Owner', value: 'Restaurant_Owner' },
                    { name: 'Delivery', value: 'Delivery_Rider' }
                  ].map((ele) => (
                    <button
                      key={ele.value}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        changeRole(ele.value);
                        setRoleClicked(false);
                      }}
                    >
                      {ele.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;