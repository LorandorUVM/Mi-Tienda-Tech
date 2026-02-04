import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        
        <Navbar />
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Ruta Protegida: Solo accesible para Administradores */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
        </Routes>

      </Box>
    </Router>
  );
}

export default App;