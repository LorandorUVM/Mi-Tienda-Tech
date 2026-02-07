import { 
    Box, Flex, Button, Heading, Spacer, HStack, Text, 
    Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box bg="teal.600" px={8} py={3} color="white" shadow="xl" position="sticky" top="0" zIndex="1000">
            <Flex alignItems="center" maxW="container.xl" mx="auto">
                <Heading size="md" cursor="pointer" _hover={{ opacity: 0.8 }}>
                    <Link to="/">Mi Tienda Tech</Link>
                </Heading>
                
                <Spacer />

                <HStack spacing={6}>
                    <Link to="/">Catálogo</Link>
                    
                    {user ? (
                        <>
                            {/* RENDERIZADO DINÁMICO: Solo el Admin ve estas opciones adicionales */}
                            {user.role === 'admin' && (
                                <HStack spacing={4}>
                                    <Link to="/admin" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                                        Panel Productos
                                    </Link>
                                    <Link to="/admin/usuarios" style={{ fontWeight: 'bold', color: '#E9D8FD' }}>
                                        Gestión Usuarios
                                    </Link>
                                </HStack>
                            )}

                            {/* MENÚ DE USUARIO LOGGEADO */}
                            <Menu>
                                <MenuButton 
                                    as={Button} 
                                    variant="link" 
                                    color="white" 
                                    rightIcon={<ChevronDownIcon />}
                                    _hover={{ textDecoration: 'none', opacity: 0.8 }}
                                >
                                    <HStack>
                                        <Avatar size="xs" name={user.nombre} bg="orange.400" color="white" />
                                        <Text display={{ base: "none", md: "block" }}>Hola, {user.nombre}</Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList color="black" shadow="2xl" borderRadius="lg">
                                    <Box px={4} py={2} bg="gray.50" mb={1}>
                                        <Text fontWeight="bold" fontSize="sm">{user.nombre} {user.apellido}</Text>
                                        <Text fontSize="xs" color="gray.500">{user.role.toUpperCase()}</Text>
                                    </Box>
                                    <MenuItem onClick={() => navigate('/perfil')}>Mi Perfil</MenuItem>
                                    <MenuItem onClick={() => navigate('/favoritos')}>Mis Favoritos</MenuItem>
                                    <MenuDivider />
                                    <MenuItem onClick={handleLogout} color="red.500" fontWeight="bold">
                                        Cerrar Sesión
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </>
                    ) : (
                        /* OPCIONES PARA VISITANTES */
                        <>
                            <Link to="/login">Iniciar Sesión</Link>
                            <Button 
                                as={Link} 
                                to="/register" 
                                colorScheme="orange" 
                                size="sm" 
                                px={6} 
                                borderRadius="full"
                                _hover={{ transform: 'scale(1.05)' }}
                            >
                                Registrarse
                            </Button>
                        </>
                    )}
                </HStack>
            </Flex>
        </Box>
    );
};

export default Navbar;