const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Adjuntar datos extraídos del JWT al request
            req.user = decoded;
            
            next();
        } catch (error) {
            return res.status(401).json({ success: false, error: 'No autorizado, token fallido o expirado' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado, no hay token' });
    }
};

// Middleware para autorizar roles específicos (ej: 'admin', 'administracion')
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, error: 'No autorizado, rol no definido' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `El rol '${req.user.role}' no está autorizado para esta acción` });
        }
        next();
    };
};

module.exports = { protect, authorize };
