import type { Metadata } from "next";
import Story from "../../screens/Story";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Explore the story behind SOLE Capsule, the founders’ vision, and the cultural mission to protect every step of sneaker ownership.",
  alternates: {
    canonical: "/story",
  },
  openGraph: {
    title: "Our Story | SOLE Capsule",
    description:
      "Explore the story, milestones, and founder vision shaping SOLE Capsule.",
    url: "/story",
    images: [{ url: "/frame.png", width: 1200, height: 630, alt: "SOLE Capsule Story" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story | SOLE Capsule",
    description:
      "Explore the story, milestones, and founder vision shaping SOLE Capsule.",
    images: ["/frame.png"],
  },
};

export default function Page() {
  return <Story />;
}
