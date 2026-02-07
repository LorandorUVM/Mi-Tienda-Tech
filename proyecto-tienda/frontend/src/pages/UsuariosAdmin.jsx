import {
    Container, Table, Thead, Tbody, Tr, Th, Td, Heading, Button,
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalCloseButton, FormControl, FormLabel, Input,
    Select, VStack, useToast, Badge, Spinner, Center, Box
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';

const UsuariosAdmin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // 1. Obtener todos los usuarios (Requisito: El admin debe ver a todos)
    const fetchUsuarios = async () => {
        try {
            const res = await clienteAxios.get('/users/all');
            setUsuarios(res.data);
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "No se pudieron cargar los usuarios registrados.", 
                status: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchUsuarios(); 
    }, []);

    // 2. Abrir modal con los datos del usuario a editar
    const handleEditClick = (user) => {
        setUsuarioSeleccionado({ ...user }); // Copia para no editar el estado original antes de guardar
        onOpen();
    };

    // 3. Guardar cambios (Requisito: El admin debe poder editar la información)
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Se envía a la ruta dinámica /api/users/:id
            await clienteAxios.put(`/users/${usuarioSeleccionado._id}`, usuarioSeleccionado);
            
            toast({ 
                title: "Usuario Actualizado", 
                description: `Se han guardado los cambios para ${usuarioSeleccionado.nombre}`, 
                status: "success" 
            });
            
            fetchUsuarios(); // Recargar la lista
            onClose(); // Cerrar modal
        } catch (error) {
            toast({ 
                title: "Error", 
                description: "Hubo un problema al actualizar los datos.", 
                status: "error" 
            });
        }
    };

    if (loading) return (
        <Center h="60vh">
            <Spinner size="xl" color="teal.500" thickness="4px" />
        </Center>
    );

    return (
        <Container maxW="container.xl" py={10}>
            <Box mb={8}>
                <Heading size="lg" color="teal.700">Panel de Control: Usuarios</Heading>
                <Badge colorScheme="purple">Acceso Administrativo</Badge>
            </Box>
            
            <Box bg="white" shadow="xl" borderRadius="2xl" overflow="hidden" border="1px" borderColor="gray.100">
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th>Nombre Completo</Th>
                            <Th>Email</Th>
                            <Th>Rol</Th>
                            <Th>Teléfono / Dirección</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {usuarios.map(user => (
                            <Tr key={user._id} _hover={{ bg: "gray.50" }}>
                                <Td fontWeight="bold">{user.nombre} {user.apellido}</Td>
                                <Td>{user.email}</Td>
                                <Td>
                                    <Badge colorScheme={user.role === 'admin' ? 'purple' : 'gray'} variant="solid">
                                        {user.role}
                                    </Badge>
                                </Td>
                                <Td fontSize="sm">
                                    {user.telefono || 'Sin teléfono'}<br/>
                                    <Box as="span" color="gray.500">{user.direccion || 'Sin dirección'}</Box>
                                </Td>
                                <Td>
                                    <Button size="sm" colorScheme="teal" variant="outline" onClick={() => handleEditClick(user)}>
                                        Editar Datos
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* MODAL DE EDICIÓN - Permite al admin modificar toda la info */}
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="2xl">
                    <ModalHeader borderBottomWidth="1px">Editar Usuario</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {usuarioSeleccionado && (
                            <VStack as="form" onSubmit={handleSave} spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input value={usuarioSeleccionado.nombre} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, nombre: e.target.value})} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Apellido</FormLabel>
                                    <Input value={usuarioSeleccionado.apellido} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, apellido: e.target.value})} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Email (ID de cuenta)</FormLabel>
                                    <Input value={usuarioSeleccionado.email} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, email: e.target.value})} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Rol en el Sistema</FormLabel>
                                    <Select value={usuarioSeleccionado.role} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, role: e.target.value})}>
                                        <option value="user">Usuario Regular</option>
                                        <option value="admin">Administrador</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Dirección</FormLabel>
                                    <Input value={usuarioSeleccionado.direccion} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, direccion: e.target.value})} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input value={usuarioSeleccionado.telefono} onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, telefono: e.target.value})} />
                                </FormControl>
                                <Button colorScheme="teal" w="full" type="submit" size="lg" mt={4}>
                                    Guardar Cambios
                                </Button>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default UsuariosAdmin;