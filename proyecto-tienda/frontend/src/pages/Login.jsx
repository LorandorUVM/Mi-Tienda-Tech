import { useState, useContext } from 'react';
import { 
    Box, Container, VStack, Heading, FormControl, FormLabel, 
    Input, Button, useToast, Text, Link as ChakraLink 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cargando, setCargando] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            await login(email, password);
            toast({
                title: "Bienvenido",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            navigate('/'); // Redirigir al catálogo
        } catch (error) {
            toast({
                title: "Error de autenticación",
                description: error.response?.data?.msg || "Credenciales incorrectas",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <Container maxW="md" py={20}>
            <Box p={8} bg="white" shadow="2xl" borderRadius="2xl" border="1px" borderColor="gray.100">
                <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                    <Heading color="teal.600">Iniciar Sesión</Heading>
                    
                    <FormControl isRequired>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <Input 
                            type="email" 
                            placeholder="admin@test.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            focusBorderColor="teal.400"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Contraseña</FormLabel>
                        <Input 
                            type="password" 
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            focusBorderColor="teal.400"
                        />
                    </FormControl>

                    <Button 
                        type="submit" 
                        colorScheme="teal" 
                        width="full" 
                        size="lg"
                        isLoading={cargando}
                    >
                        Entrar
                    </Button>

                    <Text fontSize="sm">
                        ¿No tienes cuenta?{' '}
                        <ChakraLink as={Link} to="/register" color="teal.500" fontWeight="bold">
                            Regístrate aquí
                        </ChakraLink>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default Login;