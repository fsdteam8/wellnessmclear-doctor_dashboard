import { Loader2 } from "lucide-react";
// import Image from "next/image";
import { Suspense } from "react";
import { SignUpForm } from "./_components/sign-up-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Left side - Image */}
      {/* <div className="hidden lg:w-3/5 md:w-1/2 bg-gray-900 lg:block relative">
        <Image
          src="https://files.edgestore.dev/t7diwg54d3s82m9n/wellnessmclear/_public/login.jpg"
          alt="Team meeting"
          fill
          className="object-cover"
        />
      </div> */}

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2 relative">
        <div className="mx-auto w-full max-w-md space-y-12">
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Welcome to Wellness Made Clear
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              Create an account 
            </h1>
            
          </div>

          <Suspense
            fallback={
              <div className="min-h-[400px] w-full flex justify-center items-center">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            <SignUpForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
