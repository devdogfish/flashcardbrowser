"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FieldOfStudyStep } from "./FieldOfStudyStep";
import { VerifyDalStep } from "./VerifyDalStep";

const TOTAL_STEPS = 2;

export function OnboardingFlow({
  initialStep,
  verifyError,
}: {
  initialStep: number;
  verifyError?: string | null;
}) {
  const [step, setStep] = useState(initialStep);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= step ? "bg-foreground" : "bg-border",
            )}
          />
        ))}
      </div>

      {step === 0 && <FieldOfStudyStep onNext={() => setStep(1)} />}
      {step === 1 && <VerifyDalStep initialError={verifyError} />}
    </div>
  );
}
