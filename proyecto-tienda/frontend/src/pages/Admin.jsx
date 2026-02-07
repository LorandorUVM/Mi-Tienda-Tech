import { 
    Container, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, 
    Image, IconButton, useToast, Flex, SimpleGrid, Box, Stat, 
    StatLabel, StatNumber, Badge, InputGroup, InputLeftElement,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, 
    Input, VStack 
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import clienteAxios from '../api/axios';

const Admin = () => {
    const [productos, setProductos] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [nuevoProd, setNuevoProd] = useState({
        nombre: '',
        precio: '',
        categoria: '',
        imagen: '',
        cantidad: ''
    });

    const obtenerProductos = async () => {
        try {
            const res = await clienteAxios.get('/products');
            setProductos(res.data.productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    const handleChange = (e) => {
        setNuevoProd({
            ...nuevoProd,
            [e.target.name]: e.target.value
        });
    };

    const crearProducto = async (e) => {
        e.preventDefault();
        const productoData = {
            nombre: nuevoProd.nombre,
            precio: Number(nuevoProd.precio),
            categoria: nuevoProd.categoria,
            imagen: nuevoProd.imagen,
            stock: Number(nuevoProd.cantidad),
            cantidad: Number(nuevoProd.cantidad),
            descripcion: "Nuevo producto añadido desde el panel"
        };

        try {
            await clienteAxios.post('/products', productoData);
            toast({ 
                title: "Producto creado", 
                status: "success", 
                duration: 3000, 
                isClosable: true 
            });
            setNuevoProd({ nombre: '', precio: '', categoria: '', imagen: '', cantidad: '' });
            onClose(); 
            obtenerProductos(); 
        } catch (error) {
            console.error("Error detallado:", error.response?.data);
            toast({ 
                title: "Error al guardar", 
                description: error.response?.data?.msg || "Verifica los campos", 
                status: "error" 
            });
        }
    };

    const eliminarProd = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await clienteAxios.delete(`/products/${id}`);
            toast({ title: "Eliminado", status: "success" });
            obtenerProductos(); 
        } catch (error) {
            toast({ title: "Error al eliminar", status: "error" });
        }
    };

    return (
        <Container maxW="container.xl" py={10}>
            {/* --- SECCIÓN DE ESTADÍSTICAS --- */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="xl" bg="white" borderLeft="4px solid" borderColor="teal.400">
                    <Stat>
                        <StatLabel color="gray.500" fontWeight="bold">Total Productos</StatLabel>
                        <StatNumber fontSize="3xl">{productos.length}</StatNumber>
                    </Stat>
                </Box>
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="xl" bg="white" borderLeft="4px solid" borderColor="purple.400">
                    <Stat>
                        <StatLabel color="gray.500" fontWeight="bold">Categorías</StatLabel>
                        <StatNumber fontSize="3xl">{new Set(productos.map(p => p.categoria)).size}</StatNumber>
                    </Stat>
                </Box>
                <Box p={5} shadow="md" borderRadius="xl" bg="teal.500" color="white">
                    <Stat>
                        <StatLabel fontWeight="bold">Stock Total</StatLabel>
                        <StatNumber fontSize="3xl">
                            {productos.reduce((acc, p) => acc + (p.stock || p.cantidad || 0), 0)}
                        </StatNumber>
                    </Stat>
                </Box>
            </SimpleGrid>

            {/* --- CABECERA --- */}
            <Flex justifyContent="space-between" alignItems="center" mb={8}>
                <Heading size="lg" color="gray.700">Gestión de Inventario</Heading>
                <Button 
                    leftIcon={<AddIcon />} 
                    colorScheme="teal" 
                    onClick={onOpen}
                    size="lg"
                    shadow="base"
                >
                    Nuevo Producto
                </Button>
            </Flex>

            {/* --- TABLA --- */}
            <Box bg="white" shadow="xl" borderRadius="lg" overflow="hidden" borderWidth="1px">
                <Table variant="striped" colorScheme="gray">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th py={4}>Imagen</Th>
                            <Th>Nombre</Th>
                            <Th>Categoría</Th>
                            <Th>Precio</Th>
                            <Th>Stock</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {productos.map(p => (
                            <Tr key={p._id} _hover={{ bg: "gray.50", transition: "0.2s" }}>
                                <Td>
                                    <Image src={p.imagen} boxSize="50px" objectFit="cover" borderRadius="md" shadow="sm" />
                                </Td>
                                <Td fontWeight="bold" color="gray.700">{p.nombre}</Td>
                                <Td>
                                    <Badge colorScheme="purple" variant="subtle" borderRadius="full" px={2}>
                                        {p.categoria}
                                    </Badge>
                                </Td>
                                <Td fontWeight="bold" color="teal.600">${p.precio}</Td>
                                <Td>
                                    <Badge 
                                        colorScheme={(p.stock || p.cantidad) < 5 ? "red" : "green"} 
                                        variant="solid" 
                                        borderRadius="full" 
                                        px={3}
                                    >
                                        {p.stock || p.cantidad} und
                                    </Badge>
                                </Td>
                                <Td>
                                    <IconButton 
                                        icon={<DeleteIcon />} 
                                        colorScheme="red" 
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => eliminarProd(p._id)}
                                        _hover={{ bg: "red.100" }}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* --- MODAL --- */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay backdropFilter="blur(5px)" />
                <ModalContent borderRadius="2xl">
                    <form onSubmit={crearProducto}>
                        <ModalHeader borderBottomWidth="1px">Registrar Producto</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody py={6}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Nombre del Producto</FormLabel>
                                    <Input name="nombre" value={nuevoProd.nombre} onChange={handleChange} placeholder="Ej: Mouse Gamer" focusBorderColor="teal.400" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Precio</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none" color="gray.400" children="$" />
                                        <Input name="precio" type="number" value={nuevoProd.precio} onChange={handleChange} placeholder="0.00" focusBorderColor="teal.400" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Categoría</FormLabel>
                                    <Input name="categoria" value={nuevoProd.categoria} onChange={handleChange} placeholder="Ej: Periféricos" focusBorderColor="teal.400" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>URL de Imagen</FormLabel>
                                    <Input name="imagen" value={nuevoProd.imagen} onChange={handleChange} placeholder="https://link-de-imagen.com" focusBorderColor="teal.400" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Cantidad inicial</FormLabel>
                                    <Input name="cantidad" type="number" value={nuevoProd.cantidad} onChange={handleChange} placeholder="1" focusBorderColor="teal.400" />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter bg="gray.50" borderBottomRadius="2xl">
                            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
                            <Button colorScheme="teal" type="submit" px={8} shadow="md">Guardar</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Admin;