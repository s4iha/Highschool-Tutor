"use client";

import React, { Suspense } from "react";
import { useCheckoutReturnIntent } from "../hooks/useCheckoutReturnIntent";

function ReturnIntentExecutor() {
  useCheckoutReturnIntent();
  return null;
}

export function CheckoutReturnIntentListener() {
  return (
    <Suspense fallback={null}>
      <ReturnIntentExecutor />
    </Suspense>
  );
}
