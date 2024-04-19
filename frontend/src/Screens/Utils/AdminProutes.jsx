import { useSelector } from 'react-redux';

const AdminProtectedRoutes = ({ children }) => {
    const userInfo = useSelector((state) => state.userLogin.userInfo); 
    console.log('Redux userInfo:', userInfo);

    const isAdmin = userInfo ? userInfo.user_type === 'admin' : false;

    if (isAdmin) {
        return children;
    }

    console.log('Redirecting to:', isAdmin ? 'admin page' : 'student page');
    window.history.back();
    return null; // or return a message if needed
};

export default AdminProtectedRoutes;
