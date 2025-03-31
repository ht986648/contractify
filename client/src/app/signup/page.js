"use client";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUp />
    </Suspense>
  );
}
const SignUp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stage, setStage] = useState("signup"); // 'signup' or 'otp'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  useEffect(() => {
    // Retrieve user type from localStorage
    const storedUserType = localStorage.getItem("userType");
    // console.log(storedUserType);

    if (storedUserType) {
      setFormData((prev) => ({
        ...prev,
        userType: storedUserType,
      }));
      // Clear the stored user type after retrieval
      // localStorage.removeItem("userType");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("User Type:", formData.userType);

    if (stage === "signup") {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      try {
        const apiUrl =
          formData.userType === "contractor"
            ? `${API_URL}/api/auth/contractorSignup`
            : `${API_URL}/api/auth/contracteeSignup`;

        const requestBody = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Signup failed");
        }

        // Notify the user that an email has been sent
        alert("Verification code sent to your email. Please enter the OTP.");
        // Move to OTP stage
        setStage("otp");
        startResendTimer();
      } catch (err) {
        setError(err.message || "Failed to create account. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (stage === "otp") {
      try {
        const apiUrl =
          formData.userType === "contractor"
            ? `${API_URL}/api/auth/verifyContractorEmail`
            : `${API_URL}/api/auth/verifyContracteeEmail`;

        console.log(formData.email, formData.otp);

        const otpRes = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.otp,
          }),
          credentials: "include",
        });

        const otpData = await otpRes.json();

        // Fix: Check status from `otpRes`, not `otpData`
        if (otpRes.status === 200) {
          console.log(otpData.message);
          alert("Email verified successfully!");
          router.push("/dashboard");
        } else {
          setError(otpData.message || "OTP verification failed");
        }
      } catch (err) {
        setError(err.message || "OTP verification failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const resendRes = await fetch(`${API_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        throw new Error(resendData.message || "Failed to resend OTP");
      }

      startResendTimer();
      setError("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    }
  };

  const startResendTimer = () => {
    setCanResend(false);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <motion.div
      className='min-h-screen grid lg:grid-cols-2 overflow-hidden'
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
      <div className='flex items-center justify-center bg-white px-4 py-8'>
        <motion.div className='w-full max-w-md mx-auto' variants={fadeIn}>
          <div className='space-y-3 mb-6'>
            <motion.div variants={fadeIn} className='text-center'>
              <span className='bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs sm:text-sm font-medium'>
                {stage === "signup" ? "Join Contractify" : "Verify OTP"}
              </span>
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className='text-2xl sm:text-3xl font-serif text-gray-900 text-center'
            >
              {stage === "signup" ? "Create your account" : "Verify Your Email"}
            </motion.h2>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className='space-y-4'
            variants={fadeIn}
          >
            {error && (
              <motion.div
                className='p-3 text-sm text-red-500 bg-red-50 rounded-lg'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {stage === "signup" ? (
              <>
                {formData.userType && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Selected User Type
                    </label>
                    <input
                      type='text'
                      value={
                        formData.userType.charAt(0).toUpperCase() +
                        formData.userType.slice(1)
                      }
                      disabled
                      className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600'
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Full Name
                  </label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    required
                    className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                    placeholder='Enter your full name'
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

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
                    className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChange={handleChange}
                  />
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
                    className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                    placeholder='Create a password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Confirm Password
                  </label>
                  <input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    required
                    className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='otp'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Enter OTP
                  </label>
                  <input
                    id='otp'
                    name='otp'
                    type='text'
                    required
                    maxLength='6'
                    className='mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all'
                    placeholder='Enter 6-digit OTP'
                    value={formData.otp}
                    onChange={handleChange}
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <button
                    type='button'
                    onClick={handleResendOTP}
                    disabled={!canResend}
                    className={`text-sm ${
                      canResend
                        ? "text-black hover:text-gray-700"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Resend OTP {!canResend && `(${timer}s)`}
                  </button>
                </div>
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6'
            >
              {loading
                ? stage === "signup"
                  ? "Creating account..."
                  : "Verifying..."
                : stage === "signup"
                ? "Create account"
                : "Verify OTP"}
            </button>

            {stage === "signup" && (
              <>
                <div className='relative my-4'>
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
                  className='text-center text-sm text-gray-600 mt-4'
                >
                  Already have an account?{" "}
                  <Link
                    href='/login'
                    className='font-medium text-black hover:text-gray-800'
                  >
                    Sign in
                  </Link>
                </motion.p>
              </>
            )}
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
                Join Our Growing Community
              </h2>
              <p className='text-gray-600 text-sm'>
                Join thousands of companies that trust Contractify to manage
                their contracts efficiently and securely.
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
                <p className='text-sm text-gray-600'>Join 10,000+ users</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
