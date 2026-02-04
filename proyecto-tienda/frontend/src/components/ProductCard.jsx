import { Box, Image, Text, Button, Stack, Badge } from '@chakra-ui/react'

const ProductCard = ({ producto }) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} shadow="md">
      <Image src={producto.imagen} alt={producto.nombre} borderRadius="md" />
      <Stack mt={4} spacing={2}>
        <Badge width="fit-content" colorScheme="teal">{producto.categoria}</Badge>
        <Text fontWeight="bold" fontSize="xl">{producto.nombre}</Text>
        <Text noOfLines={2} color="gray.600">{producto.descripcion}</Text>
        <Text color="teal.600" fontSize="2xl" fontWeight="bold">${producto.precio}</Text>
        <Button colorScheme="teal" size="md">Ver Detalles</Button>
      </Stack>
    </Box>
  )
}

export default ProductCard;