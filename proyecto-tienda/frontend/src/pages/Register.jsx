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

    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmar) {
            return toast({ title: "Error", description: "Las contraseñas no coinciden", status: "error" });
        }

        try {
            await clienteAxios.post('/auth/register', {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                password: formData.password
            });
            toast({ title: "Cuenta creada", description: "Ya puedes iniciar sesión", status: "success" });
            navigate('/login');
        } catch (error) {
            toast({ 
                title: "Error al registrar", 
                description: error.response?.data?.msg || "Hubo un problema", 
                status: "error" 
            });
        }
    };

    return (
        <Container maxW="lg" py={12}>
            <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <Heading size="lg" textAlign="center">Crea tu cuenta</Heading>
                        <SimpleGrid columns={2} spacing={3}>
                            <FormControl isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input name="nombre" onChange={handleChange} placeholder="Ej: Luis" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Apellido</FormLabel>
                                <Input name="apellido" onChange={handleChange} placeholder="Ej: Perez" />
                            </FormControl>
                        </SimpleGrid>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" onChange={handleChange} placeholder="correo@ejemplo.com" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Contraseña</FormLabel>
                            <Input name="password" type="password" onChange={handleChange} placeholder="********" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <Input name="confirmar" type="password" onChange={handleChange} placeholder="********" />
                        </FormControl>
                        <Button colorScheme="teal" size="lg" type="submit">Registrarse</Button>
                        <Text textAlign="center">
                            ¿Ya tienes cuenta? <Link to="/login" style={{color: 'teal'}}>Inicia sesión</Link>
                        </Text>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
};

export default Register;