import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
    const userInfo = localStorage.getItem("userInfo");
    const userType = userInfo ? JSON.parse(userInfo).user_type : null;

    if (localStorage.getItem("token") && userType === "instructor") {
        return children;
    }

    return <Navigate to="/Studenthomescreen" />;
};

export default ProtectedRoutes;
