const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Configurar dotenv apuntando a la raíz del backend
dotenv.config();

const products = [
    { nombre: "Laptop Gamer X", descripcion: "Procesador i9, 32GB RAM", precio: 1500, cantidad: 10, categoria: "Laptops", imagen: "https://picsum.photos/200/300?random=1" },
    { nombre: "Mouse Pro RGB", descripcion: "16000 DPI, inalámbrico", precio: 80, cantidad: 25, categoria: "Accesorios", imagen: "https://picsum.photos/200/300?random=2" },
    { nombre: "Monitor 4K 27\"", descripcion: "Panel IPS, 144Hz", precio: 450, cantidad: 15, categoria: "Monitores", imagen: "https://picsum.photos/200/300?random=3" },
    { nombre: "Teclado Mecánico", descripcion: "Switches Cherry MX Blue", precio: 120, cantidad: 8, categoria: "Accesorios", imagen: "https://picsum.photos/200/300?random=4" },
    { nombre: "Silla Ergonómica", descripcion: "Soporte lumbar ajustable", precio: 250, cantidad: 5, categoria: "Muebles", imagen: "https://picsum.photos/200/300?random=5" },
    { nombre: "Audífonos Studio", descripcion: "Cancelación de ruido activa", precio: 200, cantidad: 12, categoria: "Audio", imagen: "https://picsum.photos/200/300?random=6" },
    { nombre: "Smartphone Z", descripcion: "Cámara 108MP, 5G", precio: 900, cantidad: 20, categoria: "Celulares", imagen: "https://picsum.photos/200/300?random=7" },
    { nombre: "Tablet Air", descripcion: "Pantalla 11 pulgadas, 256GB", precio: 600, cantidad: 0, categoria: "Tablets", imagen: "https://picsum.photos/200/300?random=8" }, // Stock 0 (No se mostrará)
    { nombre: "Cámara Mirrorless", descripcion: "Graba en 4K 60fps", precio: 1100, cantidad: 4, categoria: "Cámaras", imagen: "https://picsum.photos/200/300?random=9" },
    { nombre: "Disco SSD 2TB", descripcion: "NVMe Gen4 ultra rápido", precio: 180, cantidad: 30, categoria: "Almacenamiento", imagen: "https://picsum.photos/200/300?random=10" },
    // Agrega 10 productos más similares para completar los 20...
    { nombre: "Router WiFi 6", descripcion: "Alta velocidad y cobertura", precio: 130, cantidad: 10, categoria: "Redes", imagen: "https://picsum.photos/200/300?random=11" },
    { nombre: "Webcam 1080p", descripcion: "Ideal para streaming y zoom", precio: 60, cantidad: 40, categoria: "Accesorios", imagen: "https://picsum.photos/200/300?random=12" },
    { nombre: "Micrófono USB", descripcion: "Calidad de estudio", precio: 110, cantidad: 15, categoria: "Audio", imagen: "https://picsum.photos/200/300?random=13" },
    { nombre: "GPU RTX 4070", descripcion: "Ray tracing avanzado", precio: 700, cantidad: 3, categoria: "Componentes", imagen: "https://picsum.photos/200/300?random=14" },
    { nombre: "Fuente 850W", descripcion: "Certificación 80 Plus Gold", precio: 140, cantidad: 20, categoria: "Componentes", imagen: "https://picsum.photos/200/300?random=15" },
    { nombre: "Escritorio Gamer", descripcion: "Ajustable en altura", precio: 300, cantidad: 6, categoria: "Muebles", imagen: "https://picsum.photos/200/300?random=16" },
    { nombre: "Hub USB-C", descripcion: "7 en 1 con HDMI 4K", precio: 45, cantidad: 50, categoria: "Accesorios", imagen: "https://picsum.photos/200/300?random=17" },
    { nombre: "Smartwatch V", descripcion: "GPS y sensor de oxígeno", precio: 220, cantidad: 18, categoria: "Relojes", imagen: "https://picsum.photos/200/300?random=18" },
    { nombre: "Parlante Bluetooth", descripcion: "Resistente al agua IPX7", precio: 90, cantidad: 22, categoria: "Audio", imagen: "https://picsum.photos/200/300?random=19" },
    { nombre: "Mando Inalámbrico", descripcion: "Compatible con PC y Consola", precio: 70, cantidad: 35, categoria: "Accesorios", imagen: "https://picsum.photos/200/300?random=20" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB para el sembrado...");
        
        await Product.deleteMany({}); // Borra productos viejos para evitar duplicados
        await Product.insertMany(products);
        
        console.log("✅ ¡Base de datos poblada con 20 productos exitosamente!");
        process.exit();
    } catch (error) {
        console.error("❌ Error al poblar la base de datos:", error);
        process.exit(1);
    }
};

seedDB();