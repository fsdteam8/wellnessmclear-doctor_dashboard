import React from "react";
import { Suspense } from "react";
import OtpFrom from "./_components/OtpFrom";

export default function OtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpFrom />
    </Suspense>
  );
}