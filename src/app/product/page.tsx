import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sole Pod",
  description:
    "Reserve your SOLE Pod with intelligent lighting, secure display, and premium sneaker protection.",
  alternates: {
    canonical: "/pod",
  },
};

export default function Page() {
  redirect("/pod");
}
