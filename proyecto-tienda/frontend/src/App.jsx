import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin'; 
import Perfil from './pages/Perfil'; 
import Favoritos from './pages/Favoritos'; 
import UsuariosAdmin from './pages/UsuariosAdmin'; 

function App() {
    const { loading } = useContext(AuthContext);

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="teal.500" thickness="4px" />
            </Center>
        );
    }

    return (
        <Router>
            <Box minH="100vh" bg="gray.50">
                <Navbar />
                
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* RUTAS PROTEGIDAS PARA USUARIOS */}
                    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                    <Route path="/favoritos" element={<ProtectedRoute><Favoritos /></ProtectedRoute>} />
                    
                    {/* RUTAS PARA ADMINISTRADORES */}
                    <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Admin /></ProtectedRoute>} />
                    <Route path="/admin/usuarios" element={<ProtectedRoute adminOnly={true}><UsuariosAdmin /></ProtectedRoute>} />
                    
                    <Route path="*" element={<Home />} />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;