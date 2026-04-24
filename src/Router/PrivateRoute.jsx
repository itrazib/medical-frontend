import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ element: Component, roles = [], ...rest }) => {
  const { user, ready } = useAuth();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
