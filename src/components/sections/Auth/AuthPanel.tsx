import { useState, type ReactNode } from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import GlowingButton from "../../ui/GlowingButton";

export type AuthField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon?: ReactNode;
  half?: boolean;
};

export type AuthValues = Record<string, string>;

interface AuthPanelProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  fields: AuthField[];
  forgotPassword?: boolean;
  onSubmit?: (values: AuthValues) => Promise<void> | void;
  submitting?: boolean;
  errorMessage?: string | null;
  successMessage?: string | null;
  initialValues?: Partial<AuthValues>;
  hideSocial?: boolean;
  onGoogleClick?: () => Promise<void> | void;
  onAppleClick?: () => Promise<void> | void;
  socialLoadingProvider?: "google" | "apple" | null;
}

const PasswordInput = ({
  placeholder = "INPUT",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/15 bg-[#171717] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-white/20"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/70"
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

const AuthPanel = ({
  title,
  subtitle,
  ctaLabel,
  fields,
  forgotPassword = false,
  onSubmit,
  submitting = false,
  errorMessage,
  successMessage,
  initialValues,
  hideSocial = false,
  onGoogleClick,
  onAppleClick,
  socialLoadingProvider = null,
}: AuthPanelProps) => {
  const submittingLabel =
    ctaLabel.toLowerCase() === "sign up"
      ? "Signing up..."
      : ctaLabel.toLowerCase() === "sign in"
        ? "Signing in..."
        : ctaLabel.toLowerCase() === "reset password"
          ? "Resetting password..."
        : "Submitting...";

  const [values, setValues] = useState<AuthValues>(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = initialValues?.[field.name] ?? "";
      return acc;
    }, {} as AuthValues),
  );

  const setValue = (name: string, next: string) => {
    setValues((prev) => ({ ...prev, [name]: next }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!onSubmit) return;
    await onSubmit(values);
  };

  return (
    <div className="w-full pb-20 pt-8">
      <section className="min-h-[72vh] px-4 py-8 sm:px-8 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/8 bg-[#191919] p-10 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-lg">
            <h1 className="text-center font-ClashGrotesk-Bold text-2xl sm:text-3xl uppercase">
              {title}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm sm:text-base text-white/35">
              {subtitle}
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.half ? "" : "md:col-span-2"}
                  >
                    <label className="mb-2 flex items-center gap-2 text-xs uppercase text-white/60">
                      {field.icon}
                      {field.label}
                    </label>
                    {field.type === "password" ? (
                      <PasswordInput
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(next) => setValue(field.name, next)}
                      />
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        placeholder={field.placeholder ?? "INPUT"}
                        value={values[field.name] ?? ""}
                        onChange={(event) => setValue(field.name, event.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-[#171717] px-4 py-2.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/20"
                      />
                    )}
                  </div>
                ))}
              </div>

              {forgotPassword ? (
                <div className="text-right text-xs sm:text-sm text-white/70">
                  <Link to="/forgot-password" className="hover:text-white">
                    Forgot Password?
                  </Link>
                </div>
              ) : null}

              {errorMessage ? (
                <p className="text-sm text-red-400">{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-green-400">{successMessage}</p>
              ) : null}

              <div className="pt-3 text-center pb-5">
                <GlowingButton
                  containerClassName="w-full"
                  className="w-full! text-sm disabled:opacity-60"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      {submittingLabel}
                    </span>
                  ) : ctaLabel}
                </GlowingButton>
              </div>

              {!hideSocial ? (
                <>
                  <p className="text-center text-sm text-white/30">
                    Or {forgotPassword ? "sign in" : "continue"} with
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-12">
                    <button
                      type="button"
                      onClick={onGoogleClick}
                      disabled={socialLoadingProvider !== null}
                      className="rounded-xl bg-[#1F1F1F] py-4 text-2xl text-white/90 hover:bg-[#2a2b30]"
                    >
                      {socialLoadingProvider === "google" ? (
                        <Loader className="mx-auto h-6 w-6 animate-spin" />
                      ) : (
                        <FaGoogle className="mx-auto" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onAppleClick}
                      disabled={socialLoadingProvider !== null}
                      className="rounded-xl bg-[#1F1F1F] py-4 text-2xl text-white/90 hover:bg-[#2a2b30]"
                    >
                      {socialLoadingProvider === "apple" ? (
                        <Loader className="mx-auto h-6 w-6 animate-spin" />
                      ) : (
                        <FaApple className="mx-auto" />
                      )}
                    </button>
                  </div>
                </>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export const loginFields: AuthField[] = [
  { name: "email", label: "EMAIL / SOLECARD ID", type: "text", icon: <FiMail /> },
  { name: "password", label: "PASSWORD", type: "password", icon: <FiLock /> },
];

export const signupFields: AuthField[] = [
  { name: "first_name", label: "FIRST NAME", type: "text", icon: <FiMail />, half: true },
  { name: "last_name", label: "LAST NAME", type: "text", icon: <FiMail />, half: true },
  { name: "email", label: "EMAIL", type: "email", icon: <FiMail /> },
  { name: "password", label: "PASSWORD", type: "password", icon: <FiLock /> },
  { name: "password_confirmation", label: "CONFIRM PASSWORD", type: "password", icon: <FiLock /> },
];

export default AuthPanel;
