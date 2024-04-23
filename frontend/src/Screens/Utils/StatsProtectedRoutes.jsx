import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const StatsProtectedRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo);
    console.log('Redux userInfo:', userInfo);

    const isAdmin = userInfo ? userInfo.isAdmin : false;
    const userType = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).user_type : '';

    const isAuthorized = isAdmin || userType === 'instructor';

    useEffect(() => {
        if (!isAuthorized) {
            console.log('Redirecting to previous page');
            window.history.back(); // Navigate back to the previous page
        }
    }, [isAuthorized]);

    return isAuthorized ? children : null;
};

export default StatsProtectedRoutes;
