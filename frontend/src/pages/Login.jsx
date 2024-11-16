import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ChevronRight } from "lucide-react";
import { useUserContext } from "../contexts/userContext";

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, login } = useUserContext();
  const [role, changeRole] = useState("customer");

  console.log("userCnetext in login ", useUserContext());

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
        role: role,
      };
      console.log("Sending ",sendVal );
      await login(sendVal);
      alert(`Welcome, ${userData.User_name}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      // Add error handling here (e.g., show error message to user)
    } finally {
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-500 to-purple-500 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="w-full md:w-1/2 p-8 lg:p-12">
            <h2 className="text-4xl font-bold text-purple-700 mb-8">
              Welcome Back
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-purple-700 mb-1"
                >
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-purple-100 border border-purple-300 text-purple-700 placeholder-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="you@example.com"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-purple-700 mb-1"
                >
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
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-purple-100 border border-purple-300 text-purple-700 placeholder-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your password"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-purple-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => changeRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 placeholder-opacity-70 focus:ring-2 focus:ring-white focus:border-transparent transition duration-200"
                >
                  <option value="Customer">Customer</option>
                  <option value="Restaurant_Owner">Restaurant Owner</option>
                  <option value="Delivery_Rider">Delivery Rider</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-purple-700 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
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
                    <>
                      Log In
                      <ChevronRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-purple-700 text-opacity-80">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-purple-700 hover:text-opacity-90 underline"
              >
                Sign up
              </a>
            </p>
          </div>

          <div
            className="hidden md:block w-1/2 bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: "url('/images/home.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-500 to-purple-500 opacity-60"></div>
            <div className="relative h-full flex items-center">
              <div className="px-12 py-8">
                <h3 className="text-4xl font-bold text-white mb-4">
                  Discover Amazing Flavors
                </h3>
                <p className="text-lg text-white opacity-90">
                  Log in to explore our delicious menu and exclusive offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
