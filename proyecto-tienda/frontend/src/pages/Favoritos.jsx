import { Container, Heading, SimpleGrid, Text, Center, VStack, Button, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import clienteAxios from '../api/axios';

const Favoritos = () => {
    const [favs, setFavs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar favoritos desde la Base de Datos (Backend)
    const cargarFavoritos = async () => {
        try {
            /** * REQUISITO: Sincronización con el modelo User de MongoDB.
             * Obtenemos el perfil completo porque ahí viene el array de objetos de productos favoritos.
             */
            const res = await clienteAxios.get('/users/profile');
            
            // Si el backend hace .populate('favoritos'), aquí tendrías los objetos completos.
            // Si no, asegúrate de que tu ruta /profile en el backend use .populate('favoritos')
            setFavs(res.data.favoritos || []);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarFavoritos();
    }, []);

    if (loading) return (
        <Center h="60vh">
            <Spinner size="xl" color="teal.500" thickness="4px" />
        </Center>
    );

    return (
        <Container maxW="container.xl" py={10}>
            <Heading mb={8} color="teal.600" textAlign={{ base: "center", md: "left" }}>
                Mis Favoritos
            </Heading>

            {/* REQUISITO: Renderizado dinámico según el estado de la lista */}
            {favs.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                    {favs.map(p => (
                        <ProductCard 
                            key={p._id} 
                            producto={p} 
                            // Pasamos la función para que al dar click al corazón se refresque esta vista
                            onAction={cargarFavoritos} 
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <Center py={20} bg="white" borderRadius="3xl" shadow="sm" border="1px dashed" borderColor="gray.200">
                    <VStack spacing={6}>
                        <Text fontSize="2xl" color="gray.400" fontWeight="medium" textAlign="center">
                            Aún no tienes productos favoritos 💔
                        </Text>
                        <Text color="gray.500" mt={-4}>
                            Agrega los productos que más te gusten para verlos aquí.
                        </Text>
                        <Button 
                            as={Link} 
                            to="/" 
                            colorScheme="teal" 
                            size="lg" 
                            variant="solid"
                            px={10}
                            borderRadius="full"
                        >
                            Explorar catálogo
                        </Button>
                    </VStack>
                </Center>
            )}
        </Container>
    );
};

export default Favoritos;