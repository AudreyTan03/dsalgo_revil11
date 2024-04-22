import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo); 
    console.log('Redux userInfo:', userInfo);

    const userType = userInfo ? userInfo.user_type : null;
    const token = userInfo ? userInfo.token : null;

    if (token && userType === "instructor") {
        return children;
    }

    // Redirect to student page if user is not an instructor
    if (token && userType !== "instructor") {
        return <Navigate to="/studenthomescreen" />;
    }

    console.log('Token from local storage:', localStorage.getItem("token.access"));
    console.log('User type:', userType);

    return null;
};

export default ProtectedRoutes;