import { useState, useContext } from 'react';
import { 
    Box, Button, FormControl, FormLabel, Input, Stack, 
    Heading, Text, useToast, Container 
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast({
                title: "¡Bienvenido!",
                description: "Has iniciado sesión correctamente",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate('/'); // Redirigir al catálogo
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.msg || "Credenciales inválidas",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="md" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <Stack spacing={4}>
                    <Heading size="lg" textAlign="center">Iniciar Sesión</Heading>
                    <Text fontSize="sm" textAlign="center">
                        Ingresa tus credenciales para continuar
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="correo@ejemplo.com"
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Contraseña</FormLabel>
                                <Input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                />
                            </FormControl>
                            <Button colorScheme="teal" size="lg" fontSize="md" type="submit">
                                Entrar
                            </Button>
                        </Stack>
                    </form>
                    <Text textAlign="center">
                        ¿No tienes cuenta? <Link to="/register" style={{color: 'teal'}}>Regístrate aquí</Link>
                    </Text>
                </Stack>
            </Box>
        </Container>
    );
};

export default Login;