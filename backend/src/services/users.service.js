const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UsersService {
    async getAll(businessId) {
        const [rows] = await db.query(`
            SELECT u.id, u.name, u.email, u.active, a.name as role 
            FROM users u
            LEFT JOIN access_groups a ON u.access_group_id = a.id
            WHERE u.business_id = ?
            ORDER BY u.id DESC
        `, [businessId]);
        return rows;
    }

    async getById(id, businessId) {
        const [rows] = await db.query(`
            SELECT u.id, u.name, u.email, u.active, u.access_group_id, a.name as role 
            FROM users u
            LEFT JOIN access_groups a ON u.access_group_id = a.id
            WHERE u.id = ? AND u.business_id = ?
        `, [id, businessId]);
        
        if (rows.length === 0) throw new Error('Usuario no encontrado');
        return rows[0];
    }

    async create(data, businessId) {
        if (!businessId) {
            console.error('[AUTH ERROR] Intento de creación de usuario sin business_id');
            throw new Error('Error interno: business_id es requerido para crear un usuario');
        }

        // Validar si el email ya existe en todo el sistema (o al menos en el negocio)
        // Por seguridad y simplicidad multi-negocio, el email debería ser único global
        const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [data.email]);
        if (exist.length > 0) throw new Error('El email ya está en uso');

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (business_id, name, email, password_hash, access_group_id, active) VALUES (?, ?, ?, ?, ?, ?)',
            [businessId, data.name, data.email, hashedPassword, data.access_group_id || 2, data.active !== undefined ? data.active : true]
        );
        
        return { id: result.insertId, ...data, business_id: businessId };
    }

    async update(id, data, businessId) {
        const user = await this.getById(id, businessId);

        // Si cambian el email, validar duplicados globales
        if (data.email && data.email !== user.email) {
            const [exist] = await db.query('SELECT id FROM users WHERE email = ?', [data.email]);
            if (exist.length > 0) throw new Error('El email ya está en uso');
        }

        const name = data.name || user.name;
        const email = data.email || user.email;
        const access_group_id = data.access_group_id || user.access_group_id;
        const active = data.active !== undefined ? data.active : user.active;

        let query = 'UPDATE users SET name = ?, email = ?, access_group_id = ?, active = ?';
        let params = [name, email, access_group_id, active];

        // Si mandan password, la actualizamos
        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            query += ', password_hash = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ? AND business_id = ?';
        params.push(id, businessId);

        await db.query(query, params);
        return { id, name, email, access_group_id, active, business_id: businessId };
    }

    async toggleActive(id, businessId) {
        const user = await this.getById(id, businessId);
        const newStatus = !user.active;
        await db.query('UPDATE users SET active = ? WHERE id = ? AND business_id = ?', [newStatus, id, businessId]);
        return { id, active: newStatus };
    }
}

module.exports = new UsersService();
