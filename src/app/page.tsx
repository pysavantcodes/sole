import type { Metadata } from "next";
import Home from "../screens/Home";

export const metadata: Metadata = {
  title: "Sole Capsule Home",
  description:
    "Discover SOLE Capsule: premium smart sneaker displays, ecosystem tools, and early-access reservation opportunities.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SOLE Capsule Home",
    description:
      "Discover SOLE Capsule: premium smart sneaker displays, ecosystem tools, and early-access reservation opportunities.",
    url: "/",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Capsule Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLE Capsule Home",
    description:
      "Discover SOLE Capsule: premium smart sneaker displays, ecosystem tools, and early-access reservation opportunities.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return <Home />;
}
