import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPanel, { signupFields, type AuthValues } from "../components/sections/Auth/AuthPanel";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (values: AuthValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const fullName = `${values.first_name ?? ""} ${values.last_name ?? ""}`.trim();

    try {
      const response = await register({
        name: fullName,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });

      setSuccessMessage(response.message ?? "Account created. Please verify your email.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialRedirect = async (provider: "google" | "apple") => {
    setErrorMessage(null);
    setSocialLoading(provider);
    try {
      const response =
        provider === "google"
          ? await authAPI.getGoogleUrl()
          : await authAPI.getAppleUrl();

      window.location.href = response.url;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to start social signup.");
      setSocialLoading(null);
    }
  };

  return (
    <AuthPanel
      title="BECOME A SOLEMATE"
      subtitle="SoleCore Intelligent Motion & Lighting Engine Real-time coordination for motion, lighting, and security"
      ctaLabel="Sign up"
      fields={signupFields}
      onSubmit={handleSignup}
      submitting={isSubmitting}
      errorMessage={errorMessage}
      successMessage={successMessage}
      onGoogleClick={() => handleSocialRedirect("google")}
      onAppleClick={() => handleSocialRedirect("apple")}
      socialLoadingProvider={socialLoading}
    />
  );
};

export default Signup;
