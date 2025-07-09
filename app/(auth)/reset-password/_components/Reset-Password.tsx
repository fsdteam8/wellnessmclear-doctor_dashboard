"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const resetPasswordMutation = useMutation({
    mutationFn: async (bodyData: { email: string; newPassword: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/reset-password`,
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
        throw new Error(errorData.message || "Password reset failed");
      }

      return res.json();
    },

    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");
      router.push("/login");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const handleSubmit = () => {
    if (!email) {
      toast.error("Missing email. Please go back and try again.");
      return;
    }

    if (!confirmPassword || confirmPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    resetPasswordMutation.mutate({ email, newPassword: confirmPassword });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="relative hidden md:block md:w-1/2 lg:w-3/5">
        <Image
          src="https://files.edgestore.dev/t7diwg54d3s82m9n/wellnessmclear/_public/login.jpg"
          alt="Team meeting"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex items-center justify-center w-full md:w-1/2 lg:w-2/5 px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              New Password
            </h2>
            <p className="text-gray-600 text-sm">
              Please create your new password.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition duration-200"
              >
                {resetPasswordMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
