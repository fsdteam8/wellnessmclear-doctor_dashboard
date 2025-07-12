// Force dynamic rendering to avoid pre-render errors
export const dynamic = "force-dynamic";

import React from "react";
import { Suspense } from "react";
import ResetPasswordForm from "./_components/Reset-Password";

export default function ResetPasswordPage() {
  return (
    
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
