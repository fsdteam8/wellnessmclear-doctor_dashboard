"use client";

import { loginFormSchema, LoginFormValues } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const rememberedEmail = Cookies.get("rememberMeEmail");
const rememberMePassword = Cookies.get("rememberMePassword");
const isRemembered = !!rememberedEmail && !!rememberMePassword;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [pending, startTransition] = useTransition();
  const [isMounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback") || undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: rememberedEmail ?? "",
      password: rememberMePassword ?? "",
      rememberMe: isRemembered ?? false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: callback || "/dashboard", // fallback to /dashboard
      });
      console.log(res)

      if (!res?.ok) {
        // Handle error case
        setIsLoading(false);
        toast.error("Login failed. Please check your credentials and try again.");
        console.error("Login failed:", res?.error);
      }


      if (res?.ok && res.url) {
        setIsLoading(false);
        toast.success("Login successful!");
        router.push(res.url);
      }

      // Set cookies for remember me
      if (data.rememberMe) {
        Cookies.set("rememberMeEmail", data.email, { expires: 7 });
        Cookies.set("rememberMePassword", data.password, { expires: 7 });
      } else {
        Cookies.remove("rememberMeEmail");
        Cookies.remove("rememberMePassword");
      }

    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const loading = isLoading;

  if (!isMounted) return null;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                      className="border-primary border-[1px] min-h-[45px]"
                      disabled={loading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your Password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-10 border-primary border-[1px] min-h-[45px]"
                      disabled={loading}
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
                    disabled={loading}
                  />
                  <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">
                    Remember me
                  </label>
                </div>
              )}
            />
            {/* Uncomment if you add Forgot Password page */}
            {/* <Link
              href="/reset-request"
              className="text-sm font-medium text-[#8C311ECC] hover:text-[#8C311ECC]/60"
            >
              Forgot password?
            </Link> */}
          </div>
          <Button type="submit" className="w-full min-h-[45px]" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">New to our platform?</span>{" "}
        <Link
          href={callback ? `/sign-up?callback=${callback}` : "/sign-up"}
          className="font-medium text-primary-blue hover:text-primary-blue/80"
        >
          Sign Up Here
        </Link>
      </div>
    </>
  );
}
