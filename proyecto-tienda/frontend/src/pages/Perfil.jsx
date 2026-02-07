import { 
    Container, Heading, VStack, FormControl, FormLabel, 
    Input, Button, useToast, Spinner, Center, Box 
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import clienteAxios from '../api/axios';

const Perfil = () => {
    const { setUser } = useContext(AuthContext);
    const [form, setForm] = useState({
        nombre: '', apellido: '', email: '', direccion: '', telefono: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const toast = useToast();

    // 1. Cargar datos del perfil al iniciar
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await clienteAxios.get('/users/profile');
                setForm(res.data);
            } catch (error) {
                toast({
                    title: "Error de conexión",
                    description: "No pudimos obtener tus datos.",
                    status: "error",
                    duration: 4000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [toast]);

    // 2. Enviar cambios al servidor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Enviamos la petición PUT al backend
            const res = await clienteAxios.put('/users/profile', form);
            
            /**
             * CORRECCIÓN CRÍTICA: 
             * Tu controlador devuelve el usuario directamente en 'res.data'.
             * Si usas 'res.data.user' el estado se vuelve undefined y falla la App.
             */
            const usuarioActualizado = res.data; 
            
            // Actualizamos estado global y almacenamiento local
            setUser(usuarioActualizado);
            localStorage.setItem('user', JSON.stringify(usuarioActualizado));

            toast({ 
                title: "Perfil actualizado", 
                description: "Tus datos se guardaron correctamente.",
                status: "success", 
                duration: 3000, 
                isClosable: true 
            });
        } catch (error) {
            toast({ 
                title: "Error", 
                description: error.response?.data?.mensaje || "No se pudieron guardar los cambios.",
                status: "error", 
                duration: 3000 
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Center h="70vh">
            <Spinner size="xl" thickness="4px" speed="0.65s" color="teal.500" />
        </Center>
    );

    return (
        <Container maxW="container.md" py={12}>
            <Box bg="white" p={{ base: 6, md: 10 }} borderRadius="3xl" shadow="2xl" border="1px" borderColor="gray.50">
                <VStack as="form" onSubmit={handleSubmit} spacing={6}>
                    <Heading size="xl" color="teal.600" mb={4}>Gestionar mi Perfil</Heading>
                    
                    <VStack spacing={4} w="full">
                        <FormControl isRequired>
                            <FormLabel fontWeight="bold">Nombre</FormLabel>
                            <Input 
                                value={form.nombre} 
                                onChange={(e) => setForm({...form, nombre: e.target.value})} 
                                focusBorderColor="teal.400"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="bold">Apellido</FormLabel>
                            <Input 
                                value={form.apellido} 
                                onChange={(e) => setForm({...form, apellido: e.target.value})} 
                                focusBorderColor="teal.400"
                            />
                        </FormControl>

                        {/* CORRECCIÓN: Usamos isReadOnly para que sea visible pero no editable */}
                        <FormControl isReadOnly>
                            <FormLabel fontWeight="bold">Correo Electrónico</FormLabel>
                            <Input 
                                value={form.email} 
                                bg="gray.50" 
                                color="gray.500"
                                cursor="not-allowed" 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="bold">Dirección</FormLabel>
                            <Input 
                                placeholder="Ej: Av. Siempreviva 742" 
                                value={form.direccion} 
                                onChange={(e) => setForm({...form, direccion: e.target.value})} 
                                focusBorderColor="teal.400"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel fontWeight="bold">Teléfono</FormLabel>
                            <Input 
                                placeholder="Ej: 041290431234" 
                                value={form.telefono} 
                                onChange={(e) => setForm({...form, telefono: e.target.value})} 
                                focusBorderColor="teal.400"
                            />
                        </FormControl>
                    </VStack>

                    <Button 
                        colorScheme="teal" 
                        w="full" 
                        type="submit" 
                        size="lg" 
                        isLoading={submitting}
                        loadingText="Guardando..."
                        borderRadius="xl"
                        h="14"
                    >
                        Actualizar mis datos
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default Perfil;