"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { loginFormSchema, LoginFormValues } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || "/dashboard";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rememberedEmail = Cookies.get("rememberMeEmail") || "";
  const rememberedPassword = Cookies.get("rememberMePassword") || "";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: rememberedEmail,
      password: rememberedPassword,
      rememberMe: !!rememberedEmail && !!rememberedPassword,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: callback,
      });

      if (!res?.ok) {
        toast.error(res?.error || "Login failed. Please try again.");
        console.log("Login failed:", res?.error);
        return;
      }

      toast.success("Login successful!");
      router.push(res.url || callback);

      if (data.rememberMe) {
        Cookies.set("rememberMeEmail", data.email, { expires: 7 });
        Cookies.set("rememberMePassword", data.password, { expires: 7 });
      } else {
        Cookies.remove("rememberMeEmail");
        Cookies.remove("rememberMePassword");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="min-h-[45px] border-primary border"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="min-h-[45px] pr-10 border-primary border"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between">
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
                  <label
                    htmlFor="rememberMe"
                    className="text-sm font-medium text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
              )}
            />

            <Link
              href="/forget-password"
              className="text-sm font-medium text-[#8C311ECC] hover:text-[#8C311ECC]/60"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full min-h-[45px]"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      {/* Sign Up Link */}
      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">New to our platform?</span>{" "}
        <Link
          href={callback !== "/dashboard" ? `/sign-up?callback=${callback}` : "/sign-up"}
          className="font-medium text-primary-blue hover:text-primary-blue/80"
        >
          Sign Up Here
        </Link>
      </div>
    </>
  );
}
