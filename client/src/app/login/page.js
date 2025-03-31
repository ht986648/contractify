"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // User type validation
    if (!formData.userType) {
      newErrors.userType = "Please select a user type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setFormData((prev) => ({
        ...prev,
        userType: storedUserType,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");
    setErrors({});

    try {
      const apiUrl =
        formData.userType === "contractor"
          ? `${API_URL}/api/auth/contractorLogin`
          : `${API_URL}/api/auth/contracteeLogin`;

      const res = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Token received from server:", data.token);
      // Cookies.set("authToken", data.token);
      // console.log("Token stored in cookie:", Cookies.get("authToken"));

      if (!res.ok) {
        switch (res.status) {
          case 400:
            if (data.errors) {
              const backendErrors = {};
              data.errors.forEach((error) => {
                backendErrors[error.field] = error.message;
              });
              setErrors(backendErrors);
            } else {
              setApiError(data.message || "Invalid request");
            }
            break;
          case 401:
            setApiError("Invalid email or password");
            break;
          case 402:
            setApiError("Account not found");
            break;
          case 422:
            if (data.errors) {
              const backendErrors = {};
              data.errors.forEach((error) => {
                backendErrors[error.field] = error.message;
              });
              setErrors(backendErrors);
            }
            break;
          case 429:
            setApiError("Too many login attempts. Please try again later.");
            break;
          case 500:
            setApiError("Server error. Please try again later.");
            break;
          default:
            setApiError(data.message || "An unexpected error occurred");
        }
        return;
      }

      // Clear any existing errors on successful login
      setErrors({});
      setApiError("");
      if (data.token) {
        try {
          // Store token securely
          Cookies.set("authToken", data.token, {
            expires: 7, // 7-day expiry
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "Strict", // Prevent CSRF attacks
          });
          console.log("Token stored in cookie:", Cookies.get("authToken"));
          // Decode token and store user email
          const decoded = jwtDecode(data.token);
          Cookies.set("userEmail", decoded.email, { expires: 7 });
        } catch (error) {
          console.error("Error storing or decoding token:", error);
        }
      } else {
        console.error("No token received from server");
      }
      localStorage.setItem("userEmail", formData.email);
      router.push("/dashboard");
    } catch (err) {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear API error when user makes any change
    if (apiError) {
      setApiError("");
    }
  };

  const getInputClassName = (fieldName) => {
    return `mt-1 text-black block w-full px-3 py-2 border ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all`;
  };

  return (
    <motion.div
      className='h-screen grid lg:grid-cols-2 overflow-hidden'
      initial='hidden'
      animate='visible'
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.5, staggerChildren: 0.1 },
        },
      }}
    >
      {/* Left Side - Form */}
      <div className='h-screen flex items-center justify-center bg-white'>
        <motion.div
          className='w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-6'
          variants={fadeIn}
        >
          {/* Logo and Header */}
          <div className='space-y-3'>
            <motion.div variants={fadeIn} className='text-center'>
              <span className='bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs sm:text-sm font-medium'>
                Welcome Back
              </span>
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className='text-2xl sm:text-3xl font-serif text-gray-900 text-center'
            >
              Sign in to your account
            </motion.h2>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className='mt-6 space-y-4'
            variants={fadeIn}
          >
            {apiError && (
              <motion.div
                className='p-3 text-sm text-red-500 bg-red-50 rounded-lg'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {apiError}
              </motion.div>
            )}

            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className={getInputClassName("email")}
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className={getInputClassName("password")}
                  placeholder='Enter your password'
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
                )}
              </div>

              <div className='flex items-center justify-end'>
                <Link
                  href='/forgot-password'
                  className='text-sm font-medium text-black hover:text-gray-800'
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6'
            >
              {loading ? (
                <span className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='grid'>
              <button
                type='button'
                className='flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all text-sm'
                onClick={() => {
                  setApiError("Google sign-in is not implemented yet");
                }}
              >
                <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                Google
              </button>
            </div>

            <motion.p
              variants={fadeIn}
              className='text-center text-sm text-gray-600 mt-6'
            >
              Don't have an account?{" "}
              <Link
                href='/signup'
                className='font-medium text-black hover:text-gray-800'
              >
                Sign up
              </Link>
            </motion.p>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Side - Image/Info */}
      <motion.div className='hidden lg:block relative' variants={fadeIn}>
        <div className='absolute inset-0 bg-gradient-to-b from-[#FFF5EB] to-white'>
          <div className='absolute inset-0 bg-black opacity-10'></div>
          <div className='absolute inset-0 flex flex-col justify-center p-8'>
            <div className='bg-white/80 backdrop-blur-sm p-6 rounded-2xl max-w-lg'>
              <h2 className='text-xl font-bold mb-3 text-black'>
                Welcome Back to Contractify
              </h2>
              <p className='text-gray-600 text-sm'>
                Access your contracts, track updates, and manage your documents
                all in one secure platform.
              </p>
              <div className='mt-4 flex items-center gap-3'>
                <div className='flex -space-x-2'>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className='w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white flex items-center justify-center text-white text-sm font-bold'
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className='text-sm text-gray-600'>
                  Trusted by 10,000+ users
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
