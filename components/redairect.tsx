"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <h1 className="text-center text-xl font-semibold">Redirecting to dashboard...</h1>
    </div>
  );
};

export default Redirect;
