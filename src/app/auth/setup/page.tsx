import type { Metadata } from "next";
import AuthSetup from "../../../screens/AuthSetup";

export const metadata: Metadata = {
  title: "Signing you in",
  robots: { index: false, follow: false },
};

export default function AuthSetupPage() {
  return <AuthSetup />;
}
