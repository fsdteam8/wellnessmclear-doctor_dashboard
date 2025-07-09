import Image from "next/image";
import ResetRequestForm from "./_components/reset-request-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:w-3/5 md:w-1/2 bg-gray-900 lg:block relative">
        <Image
          src="https://files.edgestore.dev/t7diwg54d3s82m9n/wellnessmclear/_public/reset-password.jpg"
          alt="Team meeting"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2 relative">
        <div className="mx-auto w-full max-w-md space-y-12">
          {/* Logo */}

          <div className="text-center">
            <h1 className="text-[32px] leading-[120%]  font-semibold text-gray-900">
              Reset <span className=" underline">password</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email to receive the OTP
            </p>
          </div>

          {/*  form component */}
          <ResetRequestForm />
        </div>
      </div>
    </div>
  );
}
