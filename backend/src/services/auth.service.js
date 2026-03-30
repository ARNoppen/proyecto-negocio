const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async login(email, password) {
        // Consulta del usuario con Join para obtener el nombre del rol
        const [rows] = await db.query(`
            SELECT u.*, a.name as role_name 
            FROM users u 
            LEFT JOIN access_groups a ON u.access_group_id = a.id 
            WHERE u.email = ? AND u.active = TRUE
        `, [email]);

        if (rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }

        const user = rows[0];

        // Validar integridad de business_id
        if (!user.business_id) {
            console.error(`[AUTH ERROR] Usuario con ID ${user.id} no tiene business_id asociado.`);
            throw new Error('Error de configuración de usuario: falta negocio asociado. Contacte soporte.');
        }

        // Verificar el password contra el hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
             throw new Error('Credenciales inválidas');
        }

        // Generar JWT usando sub y datos de session útiles pero no sensibles
        const token = jwt.sign(
            { 
                id: user.id, 
                business_id: user.business_id, 
                role: user.role_name 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Jornada laboral
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role_name,
                business_id: user.business_id
            }
        };
    }
}

module.exports = new AuthService();
