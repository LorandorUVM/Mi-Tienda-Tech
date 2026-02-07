import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';


const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);


    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="teal.500" thickness="4px" />
            </Center>
        );
    }


    if (!user) {
        return <Navigate to="/login" />;
    }


    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

  
    return children;
};

export default ProtectedRoute;