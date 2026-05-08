import type { Metadata } from "next";
import Signup from "../../screens/Signup";
import PublicOnlyRoute from "../../routes/PublicOnlyRoute";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your SOLE Capsule account to reserve a Sole Pod and unlock the full sneaker ownership ecosystem.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Sign Up | SOLE Capsule",
    description:
      "Create your SOLE Capsule account to reserve a Sole Pod and unlock the full sneaker ownership ecosystem.",
    url: "/signup",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Capsule Sign Up" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | SOLE Capsule",
    description:
      "Create your SOLE Capsule account to reserve a Sole Pod and unlock the full sneaker ownership ecosystem.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return (
    <PublicOnlyRoute>
      <Signup />
    </PublicOnlyRoute>
  );
}
