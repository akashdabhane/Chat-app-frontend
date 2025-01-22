import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Context";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/helper";
import LoadingSpinner from '../components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { loggedInUser, setLoggedInUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseUrl}/users/logged-in-user`,
            {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${Cookies.get('accessToken')}`,
                }
            })
            .then((response) => {
                setLoggedInUser(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [])

    // Show a loading spinner or nothing while fetching user data
    if (isLoading) {
        return <LoadingSpinner loading={isLoading} /> // Or a proper spinner
    }

    return loggedInUser !== null ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
