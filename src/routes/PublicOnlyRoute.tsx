import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white/60 text-sm">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};

export default PublicOnlyRoute;
