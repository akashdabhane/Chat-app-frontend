import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Context"; // Assuming you have AuthProvider
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated || Cookies.get("isAuthenticated") ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
