import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  isAuthorized: boolean;
  children?: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthorized,
  children,
}) => {
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
