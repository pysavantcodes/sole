import { useMemo, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthPanel, { type AuthValues } from "../components/sections/Auth/AuthPanel";
import { authAPI } from "../api";

const resetFields = [
  { name: "email", label: "EMAIL", type: "email" as const, icon: <FiMail /> },
  { name: "reset_code", label: "RESET CODE", type: "text" as const, icon: <FiMail /> },
  { name: "password", label: "NEW PASSWORD", type: "password" as const, icon: <FiLock /> },
  {
    name: "password_confirmation",
    label: "CONFIRM NEW PASSWORD",
    type: "password" as const,
    icon: <FiLock />,
  },
];

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const defaultEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);

  const handleSubmit = async (values: AuthValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const email = values.email || defaultEmail;

    try {
      await authAPI.verifyResetCode(email, values.reset_code);
      const response = await authAPI.resetPassword({
        email,
        reset_code: values.reset_code,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      setSuccessMessage(response.message ?? "Password has been successfully reset.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPanel
      title="SET NEW PASSWORD"
      subtitle="Enter your reset code and choose a new password."
      ctaLabel="Reset password"
      fields={resetFields}
      onSubmit={handleSubmit}
      submitting={isSubmitting}
      errorMessage={errorMessage}
      successMessage={successMessage}
      initialValues={defaultEmail ? { email: defaultEmail } : undefined}
      hideSocial
    />
  );
};

export default ResetPassword;
