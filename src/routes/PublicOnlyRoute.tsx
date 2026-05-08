"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  if (isBootstrapping) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white/60 text-sm">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
};

export default PublicOnlyRoute;
