"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StarField from "../ui/StarField";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-dvh flex-col">
      <StarField>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </StarField>
    </div>
  );
};

export default Layout;
