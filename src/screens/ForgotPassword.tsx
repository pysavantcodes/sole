"use client";

import { useState } from "react";
import AuthPanel, { type AuthValues } from "../components/sections/Auth/AuthPanel";
import { authAPI } from "../api";
import { FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";

const forgotPasswordFields = [
  {
    name: "email",
    label: "EMAIL",
    type: "email" as const,
    icon: <FiMail />,
    placeholder: "you@example.com",
  },
];

const ForgotPassword = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (values: AuthValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await authAPI.forgotPassword(values.email);
      setSuccessMessage(
        response.message ?? "Password reset code sent to your email.",
      );
      setTimeout(
        () => router.push(`/reset-password?email=${encodeURIComponent(values.email)}`),
        900,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Request failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel
      title="RESET YOUR PASSWORD"
      subtitle="Enter your email to receive a password reset code."
      ctaLabel="Send reset code"
      fields={forgotPasswordFields}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      errorMessage={errorMessage}
      successMessage={successMessage}
      hideSocial
    />
  );
};

export default ForgotPassword;
