import { useState } from 'react';
import { 
    Box, Button, FormControl, FormLabel, Input, Stack, 
    Heading, Text, useToast, Container, SimpleGrid 
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmar: ''
    });
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de coincidencia de contraseña
        if (formData.password !== formData.confirmar) {
            return toast({ 
                title: "Error", 
                description: "Las contraseñas no coinciden", 
                status: "error",
                isClosable: true 
            });
        }

        setCargando(true);

        try {
            // Nota: Verifica si tu ruta es /auth/register o /users/register
            await clienteAxios.post('/users/register', {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password
            });

            toast({ 
                title: "Cuenta creada", 
                description: "Ya puedes iniciar sesión con tus credenciales", 
                status: "success",
                duration: 4000
            });
            navigate('/login');
        } catch (error) {
            toast({ 
                title: "Error al registrar", 
                description: error.response?.data?.msg || "El correo ya podría estar registrado", 
                status: "error" 
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <Container maxW="lg" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="xl" bg="white">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <Heading size="lg" textAlign="center" color="teal.600" mb={2}>Crea tu cuenta</Heading>
                        
                        <SimpleGrid columns={2} spacing={3}>
                            <FormControl isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input 
                                    name="nombre" 
                                    value={formData.nombre} // Estado controlado
                                    onChange={handleChange} 
                                    placeholder="Ej: Luis" 
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Apellido</FormLabel>
                                <Input 
                                    name="apellido" 
                                    value={formData.apellido} // Estado controlado
                                    onChange={handleChange} 
                                    placeholder="Ej: Perez" 
                                />
                            </FormControl>
                        </SimpleGrid>

                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="correo@ejemplo.com" 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <Input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="********" 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <Input 
                                name="confirmar" 
                                type="password" 
                                value={formData.confirmar} 
                                onChange={handleChange} 
                                placeholder="********" 
                            />
                        </FormControl>

                        <Button 
                            colorScheme="teal" 
                            size="lg" 
                            type="submit" 
                            isLoading={cargando} // Feedback visual de carga
                        >
                            Registrarse
                        </Button>

                        <Text textAlign="center">
                            ¿Ya tienes cuenta? <Link to="/login" style={{color: 'teal', fontWeight: 'bold'}}>Inicia sesión</Link>
                        </Text>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default Register;