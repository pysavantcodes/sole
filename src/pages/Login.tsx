import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPanel, { loginFields, type AuthValues } from "../components/sections/Auth/AuthPanel";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: AuthValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login({
        email: values.email,
        password: values.password,
      });
      navigate("/account");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed.");
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
      setErrorMessage(error instanceof Error ? error.message : "Unable to start social login.");
      setSocialLoading(null);
    }
  };

  return (
    <AuthPanel
      title="WELCOME BACK SOLEMATE"
      subtitle="SoleCore Intelligent Motion & Lighting Engine Real-time coordination for motion, lighting, and security"
      ctaLabel="Sign in"
      fields={loginFields}
      forgotPassword
      onSubmit={handleLogin}
      submitting={isSubmitting}
      errorMessage={errorMessage}
      onGoogleClick={() => handleSocialRedirect("google")}
      onAppleClick={() => handleSocialRedirect("apple")}
      socialLoadingProvider={socialLoading}
    />
  );
};

export default Login;
