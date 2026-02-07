import { useEffect, useState, useContext } from 'react';
import clienteAxios from '../api/axios';
import { 
    SimpleGrid, Container, Heading, Input, Select, Stack, 
    Spinner, Box, Text, InputGroup, InputLeftElement, Center, 
    Button, HStack, useDisclosure 
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { AuthContext } from '../context/AuthContext'; // Importante para el rol
import ProductCard from '../components/ProductCard';
import AdminProductModal from '../components/AdminProductModal';

const Home = () => {
    const { user } = useContext(AuthContext); // Obtenemos el usuario actual
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('');
    const [cargando, setCargando] = useState(true);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [limite] = useState(6); 

    // Control del Modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [productoAEditar, setProductoAEditar] = useState(null);

    const obtenerProds = async () => {
        try {
            setCargando(true);
            const url = `/products?buscar=${busqueda}&categoria=${categoria}&page=${pagina}&limit=${limite}`;
            const res = await clienteAxios.get(url);
            
            setProductos(res.data.productos || []);
            setTotalPaginas(res.data.totalPaginas || 1);
            setCargando(false);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            setProductos([]);
            setCargando(false);
        }
    }; 

    useEffect(() => {
        obtenerProds();
    }, [busqueda, categoria, pagina, limite]);

    const manejarBusqueda = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);
    };

    const manejarCategoria = (e) => {
        setCategoria(e.target.value);
        setPagina(1);
    };

    const cambiarPagina = (nuevaPagina) => {
        setPagina(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Funciones para el Modal
    const abrirModalCrear = () => {
        setProductoAEditar(null); // Resetear para que el formulario esté vacío
        onOpen();
    };

    const abrirModalEditar = (producto) => {
        setProductoAEditar(producto); // Cargar el producto seleccionado
        onOpen();
    };

    return (
        <Box bg="gray.50" minH="100vh">
            <Box bg="teal.600" py={16} color="white" mb={10}>
                <Container maxW="container.xl">
                    <HStack justifyContent="space-between" alignItems="center">
                        <Box>
                            <Heading size="2xl" mb={4}>Tecnología a tu alcance</Heading>
                            <Text fontSize="xl" opacity="0.9">Encuentra los mejores productos con garantía oficial</Text>
                        </Box>
                        
                        {/* REQUISITO: Botón de creación visible solo para Admin */}
                        {user?.role === 'admin' && (
                            <Button 
                                leftIcon={<AddIcon />} 
                                colorScheme="yellow" 
                                size="lg" 
                                onClick={abrirModalCrear}
                                shadow="lg"
                            >
                                Nuevo Producto
                            </Button>
                        )}
                    </HStack>
                </Container>
            </Box>

            <Container maxW="container.xl" pb={20}>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={12} p={6} bg="white" shadow="sm" borderRadius="xl">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.400" />} />
                        <Input 
                            placeholder="¿Qué estás buscando hoy?" 
                            value={busqueda} 
                            onChange={manejarBusqueda} 
                            focusBorderColor="teal.400"
                        />
                    </InputGroup>
                    <Select 
                        placeholder="Todas las categorías" 
                        maxW={{md: "300px"}}
                        value={categoria}
                        onChange={manejarCategoria}
                        focusBorderColor="teal.400"
                    >
                        <option value="Electronica">Electrónica</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Audio">Audio</option>
                        <option value="Muebles">Muebles</option>
                    </Select>
                </Stack>

                {cargando ? (
                    <Center py={20}><Spinner size="xl" color="teal.500" thickness="4px" /></Center>
                ) : (
                    <Box>
                        {productos.length > 0 ? (
                            <>
                                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8}>
                                    {productos.map(p => (
                                        <ProductCard 
                                            key={p._id} 
                                            producto={p} 
                                            onAction={obtenerProds} // Para refrescar al eliminar
                                            onEdit={abrirModalEditar} // Para abrir el modal de edición
                                        />
                                    ))}
                                </SimpleGrid>

                                <HStack justifyContent="center" mt={12} spacing={4}>
                                    <Button 
                                        leftIcon={<ChevronLeftIcon />} 
                                        onClick={() => cambiarPagina(pagina - 1)}
                                        isDisabled={pagina === 1}
                                        colorScheme="teal"
                                    >
                                        Anterior
                                    </Button>
                                    
                                    <Box fontWeight="bold" px={4} py={2} bg="teal.50" borderRadius="md" color="teal.700">
                                        Página {pagina} de {totalPaginas}
                                    </Box>

                                    <Button 
                                        rightIcon={<ChevronRightIcon />} 
                                        onClick={() => cambiarPagina(pagina + 1)}
                                        isDisabled={pagina >= totalPaginas} 
                                        colorScheme="teal"
                                    >
                                        Siguiente
                                    </Button>
                                </HStack>
                            </>
                        ) : (
                            <Center py={20} flexDirection="column">
                                <Text fontSize="xl" color="gray.500" mb={4}>No hay productos que coincidan.</Text>
                            </Center>
                        )}
                    </Box>
                )}
            </Container>

            {/* MODAL DE ADMIN: Para crear y editar */}
            <AdminProductModal 
                isOpen={isOpen} 
                onClose={onClose} 
                productToEdit={productoAEditar} 
                onRefresh={obtenerProds} 
            />
        </Box>
    );
};

export default Home;