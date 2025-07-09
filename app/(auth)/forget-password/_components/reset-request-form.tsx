"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { resetReqestForm, ResetRequestFormValues } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetReqestForm, ResetRequestFormValues } from "@/app/schemas/auth";

export default function ResetRequestForm() {
  const form = useForm<ResetRequestFormValues>({
    resolver: zodResolver(resetReqestForm),
    defaultValues: {
      email: "",
    },
  });

  const session = useSession();
  const TOKEN = (session?.data?.user as { accessToken?: string })?.accessToken;
  const route = useRouter();

  const forgotPassMutation = useMutation({
    mutationFn: async (bodyData: { email: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/forget-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      return res.json(); // returns response data
    },

    onSuccess: (data, variables) => {
      toast.success(data?.message);
      route.push(`/otp?email=${encodeURIComponent(variables.email)}`);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  async function onSubmit(data: ResetRequestFormValues) {
    forgotPassMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email field */}
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
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full min-h-[45px]"
          disabled={forgotPassMutation.isPending}
        >
          {forgotPassMutation.isPending ? "Please wait..." : "Send OTP"}
        </Button>
      </form>
    </Form>
  );
}
