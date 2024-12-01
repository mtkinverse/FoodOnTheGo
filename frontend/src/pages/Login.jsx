import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import { useUserContext } from "../contexts/userContext";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, login, loggedIn} = useUserContext();
  const [role, changeRole] = useState("Customer");

  const setNavigation = () => {
    console.log('In navigation',userData.role);
    if (loggedIn && userData?.User_name) {
      if(userData.role === "Customer" ) {
        navigate("/");
      }
      else if(userData.role === "Restaurant_Owner"){
        navigate('/ownedRestaurants');
      }
      else if(userData.role === "Delivery_Rider"){ 
        navigate("/RiderDashboard");
        console.log('navigating ',userData.role,' to rider dashboard');
     }
     else if(userData.role === "Restaurant_Admin"){
       console.log('admin found ');
       navigate('/AdminDashboard');
     }
     else console.log('no role found');
     
   }
  }

useEffect(() => {
  console.log("Login useEffect triggered with:", {
    loggedIn,
    userDataRole: userData?.role,
    userDataComplete: !!userData?.User_name
  });
  
  if (loggedIn && userData?.role) {
    console.log("Attempting navigation for role:", userData.role);
    setNavigation();
  }
}, [loggedIn, userData]);


  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const sendVal = {
        email: values.email,
        password: values.password,
        role,
      };
      const response = await login(sendVal);
      console.log('User logged in ',userData);
    } catch (err) {
      console.log('Error executing login()');
    } finally {
      console.log('Setting loading false');
      setIsLoading(false);
      console.log('Not here');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-purple-600">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  required
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-5 py-2 pl-10 pr-3 border  placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full px-5 py-2 pl-10 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => changeRole(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                >
                  <option value="Customer">Customer</option>
                  <option value="Restaurant_Owner">Restaurant Owner</option>
                  <option value="Delivery_Rider">Delivery Rider</option>
                  <option value="Restaurant_Admin">Restaurant Admin</option>
                </select>
                <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" size={16} />
              </div>
            </div>

            {/* Submit Button */}
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
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="text-sm text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button onClick={()=>{
              navigate('/register');
            }} className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;