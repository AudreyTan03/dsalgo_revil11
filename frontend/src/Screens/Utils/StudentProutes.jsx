import { Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';


const StudentRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo); // Access userInfo from Redux state
    console.log('Redux userInfo:', userInfo);

    const userType = userInfo ? userInfo.user_type : null;
    const token = userInfo ? userInfo.token : null;


    if (token && userType === "student") {


        return children;
    }
    console.log('Token from local storage:', localStorage.getItem("token.access"));
    console.log('User type:', userType);
    console.log('Redirecting to:', userType === 'instructor' ? 'instructor page' : 'student page');


    window.history.back();

    return null;
};

export default StudentRoutes;
