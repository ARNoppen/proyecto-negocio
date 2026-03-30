const db = require('../config/db');

class SuppliersService {
    async getAll(businessId, onlyActive = false) {
        let query = 'SELECT * FROM suppliers WHERE business_id = ?';
        if (onlyActive) {
            query += ' AND active = TRUE';
        }
        query += ' ORDER BY name ASC';
        
        const [rows] = await db.query(query, [businessId]);
        return rows;
    }

    async getById(id, businessId) {
        const [rows] = await db.query(
            'SELECT * FROM suppliers WHERE id = ? AND business_id = ?',
            [id, businessId]
        );
        if (rows.length === 0) throw new Error('Proveedor no encontrado');
        return rows[0];
    }

    async create(data, businessId) {
        const [result] = await db.query(
            'INSERT INTO suppliers (business_id, name, contact_name, phone, email, active) VALUES (?, ?, ?, ?, ?, ?)',
            [
                businessId, 
                data.name, 
                data.contact_name || null, 
                data.phone || null, 
                data.email || null, 
                data.active !== undefined ? data.active : true
            ]
        );
        return { id: result.insertId, ...data, business_id: businessId };
    }

    async update(id, data, businessId) {
        await this.getById(id, businessId);

        const updates = [];
        const values = [];

        if (data.name) { updates.push('name = ?'); values.push(data.name); }
        if (data.contact_name !== undefined) { updates.push('contact_name = ?'); values.push(data.contact_name); }
        if (data.phone !== undefined) { updates.push('phone = ?'); values.push(data.phone); }
        if (data.email !== undefined) { updates.push('email = ?'); values.push(data.email); }
        if (data.active !== undefined) { updates.push('active = ?'); values.push(data.active); }

        if (updates.length === 0) return await this.getById(id, businessId);

        values.push(id, businessId);
        await db.query(`UPDATE suppliers SET ${updates.join(', ')} WHERE id = ? AND business_id = ?`, values);
        
        return await this.getById(id, businessId);
    }

    async toggleActive(id, businessId) {
        const supplier = await this.getById(id, businessId);
        const newStatus = !supplier.active;
        
        await db.query(
            'UPDATE suppliers SET active = ? WHERE id = ? AND business_id = ?',
            [newStatus, id, businessId]
        );
        
        return { success: true, message: `Proveedor ${newStatus ? 'activado' : 'desactivado'}`, active: newStatus };
    }
}

module.exports = new SuppliersService();
