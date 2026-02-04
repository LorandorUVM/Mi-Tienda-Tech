import { 
    Container, Heading, Button, Table, Thead, Tbody, Tr, Th, Td, 
    Image, IconButton, useToast, Flex,
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
        
        // CORRECCIÓN: Preparamos un objeto que cubra todos los nombres posibles
        // y añadimos una descripción por si el backend la requiere obligatoriamente.
        const productoData = {
            nombre: nuevoProd.nombre,
            precio: Number(nuevoProd.precio),
            categoria: nuevoProd.categoria,
            imagen: nuevoProd.imagen,
            stock: Number(nuevoProd.cantidad),     // Nombre estándar
            cantidad: Number(nuevoProd.cantidad),  // Nombre alternativo
            descripcion: "Nuevo producto añadido desde el panel" // Campo común obligatorio
        };

        try {
            await clienteAxios.post('/products', productoData);
            
            toast({ 
                title: "Producto creado", 
                status: "success", 
                duration: 3000, 
                isClosable: true 
            });
            
            // Limpiar campos y cerrar modal
            setNuevoProd({ nombre: '', precio: '', categoria: '', imagen: '', cantidad: '' });
            onClose(); 
            obtenerProductos(); 
        } catch (error) {
            // Esto imprimirá en tu consola del navegador el error real si el backend lo envía
            console.error("Error detallado:", error.response?.data);
            
            toast({ 
                title: "Error al guardar", 
                description: error.response?.data?.msg || "Verifica que todos los campos sean correctos", 
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
            <Flex justifyContent="space-between" alignItems="center" mb={8}>
                <Heading size="lg">Gestión de Inventario</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
                    Nuevo Producto
                </Button>
            </Flex>

            <Table variant="simple" bg="white" shadow="md" borderRadius="lg">
                <Thead bg="gray.100">
                    <Tr>
                        <Th>Imagen</Th>
                        <Th>Nombre</Th>
                        <Th>Categoría</Th>
                        <Th>Precio</Th>
                        <Th>Stock</Th>
                        <Th>Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {productos.map(p => (
                        <Tr key={p._id}>
                            <Td><Image src={p.imagen} boxSize="50px" objectFit="cover" borderRadius="md" /></Td>
                            <Td fontWeight="bold">{p.nombre}</Td>
                            <Td>{p.categoria}</Td>
                            <Td>${p.precio}</Td>
                            <Td>{p.stock || p.cantidad}</Td>
                            <Td>
                                <IconButton 
                                    icon={<DeleteIcon />} 
                                    colorScheme="red" 
                                    size="sm"
                                    onClick={() => eliminarProd(p._id)}
                                />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={crearProducto}>
                        <ModalHeader>Agregar Nuevo Producto</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input name="nombre" value={nuevoProd.nombre} onChange={handleChange} placeholder="Ej: Mouse Gamer" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Precio</FormLabel>
                                    <Input name="precio" type="number" value={nuevoProd.precio} onChange={handleChange} placeholder="25.50" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Categoría</FormLabel>
                                    <Input name="categoria" value={nuevoProd.categoria} onChange={handleChange} placeholder="Ej: Accesorios" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>URL Imagen</FormLabel>
                                    <Input name="imagen" value={nuevoProd.imagen} onChange={handleChange} placeholder="https://..." />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Stock / Cantidad</FormLabel>
                                    <Input name="cantidad" type="number" value={nuevoProd.cantidad} onChange={handleChange} placeholder="10" />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
                            <Button colorScheme="teal" type="submit">Guardar Producto</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Admin;