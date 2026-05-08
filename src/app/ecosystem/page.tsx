import type { Metadata } from "next";
import Ecosystem from "../../screens/Ecosystem";

export const metadata: Metadata = {
  title: "Our Ecosystem",
  description:
    "Discover the SOLE ecosystem: app tools, authentication workflows, AI support, and connected features built around your sneaker collection.",
  alternates: {
    canonical: "/ecosystem",
  },
  openGraph: {
    title: "Our Ecosystem | SOLE Capsule",
    description:
      "Connected tools and services powering the SOLE Capsule ownership experience.",
    url: "/ecosystem",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Ecosystem" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Ecosystem | SOLE Capsule",
    description:
      "Connected tools and services powering the SOLE Capsule ownership experience.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return <Ecosystem />;
}
