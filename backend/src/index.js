require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rutas
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth.routes');
const categoriesRoutes = require('./routes/categories.routes');
const productsRoutes = require('./routes/products.routes');
const brandsRoutes = require('./routes/brands.routes');
const suppliersRoutes = require('./routes/suppliers.routes');
const usersRoutes = require('./routes/users.routes');
const publicRoutes = require('./routes/public.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const settingsRoutes = require('./routes/settings.routes');

// Middlewares
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Configuración de CORS dinámico para producción y local
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (Postman, curl, health checks)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            frontendUrl,
            'http://localhost:5173'
        ];

        // Permitir el origin exacto o cualquier preview de Vercel del proyecto
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            return callback(null, origin);
        }

        callback(new Error('Bloqueado por CORS'));
    },
    credentials: true
}));
app.use(express.json());

// Montaje de rutas
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
    res.send('API Almacen Montt funcionando correctamente.');
});

// Middleware de manejo de errores (siempre al final de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
