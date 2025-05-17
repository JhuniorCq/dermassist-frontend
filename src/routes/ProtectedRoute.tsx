import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  isAllowed,
  children,
  redirectTo = "/",
}: {
  isAllowed: boolean;
  children?: ReactNode;
  redirectTo?: string;
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
