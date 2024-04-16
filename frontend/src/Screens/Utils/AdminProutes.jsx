import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo); // Access userInfo from Redux state
    console.log('Redux userInfo:', userInfo);

    const userType = userInfo ? userInfo.user_type : null;
    const isAdmin = userInfo ? userInfo.isAdmin : null;
    const token = userInfo ? userInfo.token : null;

    if (token) {
        if (isAdmin) {
            return <Navigate to="/adminPage" />;
        } else if (userType === "student") {
            return children;
        } else if (userType === "instructor") {
            return <Navigate to="/instructorPage" />;
        }
    }

    console.log('Token from local storage:', localStorage.getItem("token.access"));
    console.log('User type:', userType);
    console.log('Redirecting to:', userType === 'instructor' ? 'instructor page' : 'student page');

    return <Navigate to="/homeScreen" />;
};

export default ProtectedRoutes;
