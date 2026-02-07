import { 
  Box, Image, Text, Button, Stack, Badge, Flex, 
  useColorModeValue, IconButton, useToast 
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { AiFillHeart, AiOutlineHeart, AiFillDelete, AiFillEdit } from 'react-icons/ai'; 
import { AuthContext } from '../context/AuthContext';
import clienteAxios from '../api/axios';

// Añadimos onEdit a las props
const ProductCard = ({ producto, onAction, onEdit }) => {
  const { user } = useContext(AuthContext);
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const toast = useToast();
  const [isFav, setIsFav] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setIsFav(favs.some(f => f._id === producto._id));
  }, [producto._id]);

  const toggleFavoritos = () => {
    if (!user) {
      toast({ title: "Inicia sesión", status: "warning", duration: 2000 });
      return;
    }

    let favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    if (isFav) {
      favs = favs.filter(f => f._id !== producto._id);
      setIsFav(false);
      toast({ title: "Eliminado de favoritos", status: "info", duration: 1500 });
    } else {
      favs.push(producto);
      setIsFav(true);
      toast({ title: "¡Añadido!", status: "success", duration: 1500 });
    }
    localStorage.setItem('favoritos', JSON.stringify(favs));
    if (onAction) onAction();
  };

  const eliminarProducto = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    setEliminando(true);
    try {
      await clienteAxios.delete(`/products/${producto._id}`);
      toast({ title: "Producto eliminado", status: "success" });
      if (onAction) onAction();
    } catch (error) {
      toast({ title: "Error al eliminar", status: "error" });
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Box 
      maxW="sm" borderWidth="1px" borderRadius="2xl" overflow="hidden" bg={cardBg}
      transition="all 0.3s ease" _hover={{ transform: 'translateY(-10px)', shadow: '2xl' }}
      shadow="md" display="flex" flexDirection="column" height="100%" position="relative"
    >
      <Box position="relative" overflow="hidden">
        {/* BOTÓN FAVORITOS */}
        <IconButton
          position="absolute" top={3} left={3} zIndex={10} colorScheme="red" variant="solid"
          borderRadius="full" size="sm" icon={isFav ? <AiFillHeart /> : <AiOutlineHeart />}
          onClick={toggleFavoritos} aria-label="Favoritos" shadow="md"
        />

        {/* ACCIONES DE ADMIN (Eliminar y Editar) */}
        {user?.role === 'admin' && (
          <Flex position="absolute" top={3} left={12} zIndex={10} gap={2}>
            <IconButton
              colorScheme="red" icon={<AiFillDelete />} onClick={eliminarProducto} 
              isLoading={eliminando} aria-label="Eliminar" borderRadius="full" size="sm" shadow="md"
            />
            {/* BOTÓN EDITAR (REQUISITO: Pre-llenar formulario) */}
            <IconButton
              colorScheme="blue" icon={<AiFillEdit />} 
              onClick={() => onEdit(producto)} // Pasamos el producto completo a la función de edición
              aria-label="Editar producto" borderRadius="full" size="sm" shadow="md"
            />
          </Flex>
        )}

        <Image 
          src={producto.imagen} alt={producto.nombre} h="220px" w="100%" objectFit="cover" 
          fallbackSrc="https://via.placeholder.com/220"
        />
        <Badge position="absolute" top={3} right={3} px={3} py={1} borderRadius="full" colorScheme="teal" shadow="sm">
          {producto.categoria}
        </Badge>
      </Box>

      <Stack p={5} spacing={3} flex="1">
        <Text fontWeight="bold" fontSize="xl" color={textColor} noOfLines={1}>{producto.nombre}</Text>
        <Text noOfLines={2} color="gray.500" fontSize="sm" h="40px">{producto.descripcion}</Text>

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="teal.600" fontSize="2xl" fontWeight="black">${producto.precio}</Text>
          <Badge colorScheme={(producto.stock || producto.cantidad) > 0 ? "green" : "red"}>
            {(producto.stock || producto.cantidad) > 0 ? `Stock: ${producto.stock || producto.cantidad}` : 'Agotado'}
          </Badge>
        </Flex>

        <Button colorScheme="teal" size="md" width="100%" mt="auto" isDisabled={(producto.stock || producto.cantidad) <= 0}>
          Ver Detalles
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductCard;