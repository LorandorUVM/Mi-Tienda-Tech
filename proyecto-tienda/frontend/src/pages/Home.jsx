import { useEffect, useState } from 'react';
import clienteAxios from '../api/axios';
import { SimpleGrid, Container, Heading, Input, Select, Stack, Spinner } from '@chakra-ui/react';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerProds = async () => {
            try {
                const res = await clienteAxios.get(`/products?buscar=${busqueda}&categoria=${categoria}`);
                setProductos(res.data.productos);
                setCargando(false);
            } catch (error) {
                console.error(error);
            }
        };
        obtenerProds();
    }, [busqueda, categoria]); // Se ejecuta cada vez que cambia el filtro

    return (
        <Container maxW="container.xl" py={10}>
            <Heading mb={6}>Catálogo de Productos</Heading>
            
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={10}>
                <Input placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                <Select placeholder="Todas las categorías" onChange={(e) => setCategoria(e.target.value)}>
                    <option value="Electronica">Electrónica</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Audio">Audio</option>
                    {/* Agrega más según tus 20 productos */}
                </Select>
            </Stack>

            {cargando ? <Spinner /> : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
                    {productos.map(p => <ProductCard key={p._id} producto={p} />)}
                </SimpleGrid>
            )}
        </Container>
    );
};

export default Home;