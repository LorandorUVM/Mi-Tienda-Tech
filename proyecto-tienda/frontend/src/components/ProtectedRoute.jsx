import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);


    if (loading) return <Center h="100vh"><Spinner size="xl" /></Center>;

    
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    
    return children;
};

export default ProtectedRoute; 