"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpFormSchema, SignUpFormValues } from "@/app/schemas/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || undefined;

  // Initialize the form
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  async function onSubmit(data: SignUpFormValues) {
    try {
      setLoading(true);
      // Store in localStorage
      localStorage.setItem("signupData", JSON.stringify(data));

      // Redirect to complete-profile
      router.push("/complete-profile");
    } catch (error) {
      console.error("LocalStorage Save Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const isLoading = loading;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[24px]">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <label className="my-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your first name"
                    type="text"
                    autoComplete="given-name"
                    className="border-primary border-[1px] min-h-[45px]"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <label className="my-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your last name"
                    type="text"
                    autoComplete="family-name"
                    className="border-primary border-[1px] min-h-[45px]"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <label className="my-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    type="email"
                    autoComplete="email"
                    className="border-primary border-[1px] min-h-[45px]"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <label className="my-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10 border-primary border-[1px] min-h-[45px]"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <label className="my-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="pr-10 border-primary border-[1px] min-h-[45px]"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
                  Remember me
                </label>
              </div>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="min-h-[45px] w-full" disabled={isLoading}>
            {isLoading ? "Redirecting..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Link to Login */}
      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">Already have an account?</span>{" "}
        <Link
          href={callback ? `/login?callback=${callback}` : "/login"}
          className="font-medium text-orange-500 hover:text-orange-600"
        >
          Sign In Here
        </Link>
      </div>
    </>
  );
}
