import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';
import { useAlertContext } from '../contexts/alertContext';

const OTPPopup = ({ isOpen, onClose, onVerify, email }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
    }
  }, [isOpen]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    setOtp((prevOtp) => prevOtp.map((d, idx) => (idx === index ? element.value : d)));
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post('/api/resend-otp/', { email });
      setTimer(60);
      setCanResend(false);
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Enter OTP</h2>
          <p className="text-gray-600 mb-6">
            We've sent a code to {email}. Enter it below to verify your email.
          </p>
          <div className="flex justify-between mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-12 h-12 text-center text-2xl border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200"
            onClick={() => onVerify(otp.join(''))}
          >
            Verify OTP
          </button>
          <div className="mt-4 text-center">
            {canResend ? (
              <button
                className="text-purple-600 hover:text-purple-700"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600">Resend OTP in {timer} seconds</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

const Register = () => {
  const { setAlert } = useAlertContext();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    phoneNo: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [roleClicked, setRoleClicked] = useState(false);
  const [role, changeRole] = useState('customer');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  
  function isValidPhoneNumber(phoneNumber) {
    const phoneRegex = /^(\+92\s?|0)?(3\d{2})\s?\d{7}$/;
    
    return phoneRegex.test(phoneNumber);
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!isValidPhoneNumber(values.phoneNo)) {
      setAlert({ message: 'Invalid phone number format!', type: 'error' });
      setIsLoading(false);
      return;
    }
    
    try {
      // Send OTP to user's email
      console.log('sending otp to ',values.email);
      await axios.post('/api/send-otp', { email: values.email });
      setShowOTPPopup(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setAlert({ message: 'Failed to send OTP. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (enteredOTP) => {
    setIsLoading(true);
    try {
      // Verify OTP
      await axios.post('/api/verify-otp', { email: values.email, otp: enteredOTP });
      
      // If OTP is verified, proceed with registration
      const sendVal = {
        name: `${values.firstname} ${values.lastname}`,
        email: values.email,
        password: values.password,
        phoneNo: values.phoneNo,
        role,
      };

      const res = await axios.post('/api/register', sendVal, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log(res.data);
      setAlert({ message: 'Account created, login now!', type: 'success' });
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setAlert({ message: err.response?.data || 'Failed to verify OTP or register. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
      setShowOTPPopup(false);
    }
  };

  return (
   <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-purple-600">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us to explore amazing food experiences</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  required
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={values.firstname}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="First Name"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              <div>
                <input
                  required
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={values.lastname}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Last Name"
                />
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div className="relative">
              <input
                required
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={values.phoneNo}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border ${
                  isPhoneValid ? 'border-gray-300' : 'border-red-500'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                placeholder="+92 XXX XXXXXXX or 0XXX XXXXXXX"
              />
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <div>
              <input
                required
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Email address"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <div>
              <input
                required
                id="password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Password"
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <div className="relative">
              <button
                className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-purple-500 sm:text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setRoleClicked((prev) => !prev);
                }}
              >
                <span>{role === 'customer' ? 'Select Role' : role}</span>
                <ChevronRight
                  className={`transform transition-transform duration-200 ${roleClicked ? 'rotate-90' : ''}`}
                  size={16}
                />
              </button>

              {roleClicked && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                  {[
                    { name: 'Customer', value: 'Customer' },
                    { name: 'Owner', value: 'Restaurant_Owner' },
                    { name: 'Delivery', value: 'Delivery_Rider' },
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button onClick={()=>{ navigate('/login')}} className="font-medium text-purple-600 hover:text-purple-500">
              Sign in
            </button>
          </div>
        </div>
      </div>

      <OTPPopup
        isOpen={showOTPPopup}
        onClose={() => setShowOTPPopup(false)}
        onVerify={handleOTPVerification}
        email={values.email}
      />
    </div>
  );
};

export default Register;
