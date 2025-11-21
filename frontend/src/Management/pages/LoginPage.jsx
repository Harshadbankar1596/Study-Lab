import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useVerifyOtpMutation } from "../redux/Api/AuthApi";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const LoginPage = () => {
  const navigate = useNavigate();
  const [sendOtp, { isLoading: isLoadingSendOtp }] = useLoginMutation();
  const [VerifyOTP, { isLoading: isLoadingVerifyOTP }] = useVerifyOtpMutation();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Validation schemas
  const mobileValidationSchema = Yup.object({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
      .required("Mobile number is required"),
  });

  const otpValidationSchema = Yup.object({
    mobile: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
      .required("Mobile number is required"),
    otp: Yup.string()
      .matches(/^\d{6}$/, "Please enter a valid 6-digit OTP")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
    },
    validationSchema: isOtpSent ? otpValidationSchema : mobileValidationSchema,
    onSubmit: async (values) => {
      if (isOtpSent) {
        try {
          const res = await VerifyOTP({
            contact: values.mobile,
            otp: values.otp,
          }).unwrap();
          navigate("/");
          toast.success(res?.message);
        } catch (error) {
          toast.error(error?.data?.error, { duration: 5000 });
        }
      } else {
        try {
          const res = await sendOtp({ contact: values.mobile }).unwrap();
          toast.success(res?.message);
          setIsOtpSent(true);
          setOtpTimer(60); // Start 60 second timer
        } catch (error) {
          toast.error(error?.data?.error, { duration: 5000 });
        }
      }
    },
  });

  const handleResendOtp = async () => {
    // Validate mobile before resending
    const mobileError = await formik.validateField("mobile");

    if (mobileError) {
      formik.setFieldTouched("mobile", true);
      return;
    }

    try {
      const res = await sendOtp({ contact: formik.values.mobile }).unwrap();
      toast.success(res?.message);
      formik.setFieldValue("otp", "");
      formik.setFieldTouched("otp", false);
      setOtpTimer(60); // Restart timer
    } catch (error) {
      toast.error(error?.data?.error, { duration: 5000 });
    }
  };

  return (
    <div className="h-screen px-11 flex items-center justify-center bg-white overflow-hidden">
      <div className="flex w-[90%] h-[90%] bg-[#0a57db] rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Illustration */}
        <div className="w-1/2 h-full">
          <img
            src="/log.png"
            alt="Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Section (Card Form) */}
        <div className="flex items-center justify-center w-1/2 p-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 h-[500px]">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="StudyLab Logo"
              className="w-36 mx-auto mb-10 object-contain"
            />

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    name="mobile"
                    maxLength="10"
                    value={formik.values.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      formik.setFieldValue("mobile", value);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Mobile Number"
                    className={`w-full px-4 py-3 border ${
                      formik.touched.mobile && formik.errors.mobile
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 ${
                      formik.touched.mobile && formik.errors.mobile
                        ? "focus:ring-red-500"
                        : "focus:ring-blue-500"
                    } bg-white`}
                    disabled={isOtpSent}
                  />
                </div>
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.mobile}
                  </p>
                )}
              </div>

              <div className={`${!isOtpSent && "hidden"}`}>
                <input
                  type="text"
                  name="otp"
                  maxLength="6"
                  value={formik.values.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    formik.setFieldValue("otp", value);
                  }}
                  onBlur={formik.handleBlur}
                  placeholder="Enter OTP"
                  className={`w-full px-4 py-3 border ${
                    formik.touched.otp && formik.errors.otp
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 ${
                    formik.touched.otp && formik.errors.otp
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } bg-white`}
                />
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.otp}
                  </p>
                )}

                {/* Timer and Resend OTP section */}
                <div className="flex items-center justify-between mt-2">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-gray-600">
                      OTP will expire in{" "}
                      <span className="font-semibold text-red-600">
                        {otpTimer} seconds
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 font-medium">
                      OTP expired
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoadingSendOtp || otpTimer > 0}
                    className={`text-sm font-medium transition ${
                      otpTimer > 0 || isLoadingSendOtp
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoadingSendOtp || isLoadingVerifyOTP}
                className={`w-full py-3 mt-4 bg-blue-600 text-white font-semibold 
                            rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoadingSendOtp || isLoadingVerifyOTP ? (
                  <BeatLoader
                    className="flex items-center justify-center"
                    color="#fff"
                    size={8}
                  />
                ) : !isOtpSent ? (
                  "Send OTP"
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
