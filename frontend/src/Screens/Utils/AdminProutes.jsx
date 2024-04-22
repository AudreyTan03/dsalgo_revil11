import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const AdminProtectedRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo); 
    console.log('Redux userInfo:', userInfo);

    const isAdmin = userInfo ? userInfo.isAdmin : false;

    useEffect(() => {
        if (!isAdmin) {
            console.log('Redirecting to previous page');
            window.history.back(); // Navigate back to the previous page
        }
    }, [isAdmin]);

    return isAdmin ? children : null; // Render children only if user is admin
};

export default AdminProtectedRoutes;