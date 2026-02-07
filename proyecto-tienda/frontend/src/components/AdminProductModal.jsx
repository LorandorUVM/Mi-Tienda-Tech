import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
    Input, NumberInput, NumberInputField, Textarea, Select, VStack, useToast
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import clienteAxios from '../api/axios';

const AdminProductModal = ({ isOpen, onClose, productToEdit, onRefresh }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        cantidad: '',
        imagen: '',
        categoria: ''
    });

    // Si hay un producto para editar, pre-llenamos el formulario
    useEffect(() => {
        if (productToEdit) {
            setFormData(productToEdit);
        } else {
            setFormData({ nombre: '', descripcion: '', precio: '', cantidad: '', imagen: '', categoria: '' });
        }
    }, [productToEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (productToEdit) {
                // ACTUALIZAR (PUT)
                await clienteAxios.put(`/products/${productToEdit._id}`, formData);
                toast({ title: "Producto actualizado", status: "success" });
            } else {
                // CREAR (POST)
                await clienteAxios.post('/products', formData);
                toast({ title: "Producto creado", status: "success" });
            }
            onRefresh(); // Refresca la lista en la Home
            onClose();   // Cierra el modal
        } catch (error) {
            toast({ title: "Error", description: "No se pudo guardar", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="2xl">
                <ModalHeader>{productToEdit ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody as="form" id="product-form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Nombre del Producto</FormLabel>
                            <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Monitor Gamer" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Categoría</FormLabel>
                            <Select name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Selecciona categoría">
                                <option value="Electrónica">Electrónica</option>
                                <option value="Hogar">Hogar</option>
                                <option value="Ropa">Ropa</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Precio ($)</FormLabel>
                            <Input name="precio" type="number" value={formData.precio} onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Cantidad (Stock)</FormLabel>
                            <Input name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>URL de la Imagen</FormLabel>
                            <Input name="imagen" value={formData.imagen} onChange={handleChange} placeholder="https://ejemplo.com/foto.jpg" />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Descripción</FormLabel>
                            <Textarea name="descripcion" value={formData.descripcion} onChange={handleChange} />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
                    <Button colorScheme="teal" type="submit" form="product-form" isLoading={loading}>
                        {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AdminProductModal;