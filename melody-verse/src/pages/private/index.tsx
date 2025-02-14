import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { isValidToken } from "../../lib/auth";


const PrivateRoutes = () => {
  const token = Cookies.get('token');
  const isAuthenticated = isValidToken(token)


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;