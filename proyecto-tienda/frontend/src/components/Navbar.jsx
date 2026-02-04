import { Box, Flex, Button, Heading, Spacer, HStack, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box bg="teal.500" px={8} py={4} color="white" shadow="lg">
            <Flex alignItems="center">
                <Heading size="md" cursor="pointer">
                    <Link to="/">Mi Tienda Tech</Link>
                </Heading>
                
                <Spacer />

                <HStack spacing={6}>
                    <Link to="/">Catálogo</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'admin' && <Link to="/admin">Panel Admin</Link>}
                            <Text fontWeight="bold">Hola, {user.nombre}</Text>
                            <Button colorScheme="red" size="sm" onClick={handleLogout}>
                                Salir
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Iniciar Sesión</Link>
                            <Button colorScheme="orange" size="sm">
                                <Link to="/register">Registrarse</Link>
                            </Button>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;