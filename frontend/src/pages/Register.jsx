import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    phoneNo: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await axios.post('/register', values);
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      // Add error handling here (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 via-red-500 to-red-500 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            <h2 className="text-4xl font-bold text-white mb-8">Create an Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'firstname', label: 'First Name', type: 'text', icon: User, placeholder: 'Enter your first name' },
                { name: 'lastname', label: 'Last Name', type: 'text', icon: User, placeholder: 'Enter your last name' },
                { name: 'phoneNo', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+92 --- -------' },
                { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com' },
                { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'Create a password' },
              ].map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-medium text-white mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      required
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                      placeholder={field.placeholder}
                    />
                    <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70" size={18} />
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="submit"
                  className="w-full bg-white text-red-700 rounded-lg px-4 py-3 font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-700 transition duration-200 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-red-700" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <>
                      Sign Up
                      <ChevronRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
            <p className="mt-8 text-center text-sm text-white text-opacity-80">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-white hover:text-opacity-90 underline">
                Log in
              </a>
            </p>
          </div>

          <div className="hidden md:block w-1/2 bg-cover bg-center relative overflow-hidden"
               style={{ backgroundImage: "url('/images/home.png')" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-500 to-red-500 opacity-60"></div>
            <div className="relative h-full flex items-center">
              <div className="px-12 py-8">
                <h3 className="text-4xl font-bold text-white mb-4">Discover Amazing Flavors</h3>
                <p className="text-lg text-white opacity-90">Join us to explore our delicious menu and exclusive offers.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;