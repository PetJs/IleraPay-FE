import { Navigate } from "react-router-dom";
import useUserStore from "@/store/user-store";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthorized = useUserStore((s) => s.authorized);

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;