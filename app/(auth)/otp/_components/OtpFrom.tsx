"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function OtpFrom() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email");

  useEffect(() => {
    if (email) {
      console.log("Received email from URL:", email);
    }
  }, [email]);

  const otpMutation = useMutation({
    mutationFn: async (bodyData: { email: string; otp: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      return res.json();
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "OTP verified successfully");
      router.push(`/reset-password?email=${encodeURIComponent(variables.email)}`);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Invalid OTP");
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name="otp-${index + 1}"]`
        );
        if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6 || !email) {
      toast.error("Please enter a valid 6-digit OTP and email");
      return;
    }

    otpMutation.mutate({ email, otp: otpCode });
  };

  const resendOtp = () => {
    console.log("Resending OTP...");
    // You can trigger resend API here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex">
      {/* Left image */}
      <div className="hidden lg:w-3/5 md:w-1/2 bg-gray-900 lg:block relative">
        <Image
          src="https://files.edgestore.dev/t7diwg54d3s82m9n/wellnessmclear/_public/login.jpg"
          alt="Team meeting"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h2>
            <p className="text-gray-600 text-sm">
              An OTP has been sent to your email address.
              <br />
              Please verify it below.
            </p>
            {email && (
              <p className="text-sm text-gray-800 mt-2">
                <strong>Email:</strong> {email}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-green-400 focus:outline-none text-lg font-semibold"
                  maxLength={1}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              disabled={otpMutation.isPending}
            >
              {otpMutation.isPending ? "Verifying..." : "Verify"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn’t receive OTP?{" "}
              <button
                onClick={resendOtp}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Resend OTP
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
