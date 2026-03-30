const db = require('../config/db');

class BrandsService {
    async getAll(businessId) {
        const [rows] = await db.query(
            'SELECT * FROM brands WHERE business_id = ? ORDER BY name ASC',
            [businessId]
        );
        return rows;
    }

    async getById(id, businessId) {
        const [rows] = await db.query(
            'SELECT * FROM brands WHERE id = ? AND business_id = ?',
            [id, businessId]
        );
        
        if (rows.length === 0) {
            throw new Error('Marca no encontrada');
        }
        
        return rows[0];
    }

    async create(data, businessId) {
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const [result] = await db.query(
            'INSERT INTO brands (business_id, name, slug, active) VALUES (?, ?, ?, ?)',
            [businessId, data.name, slug, data.active !== undefined ? data.active : true]
        );
        
        return { id: result.insertId, ...data, slug, business_id: businessId };
    }

    async update(id, data, businessId) {
        await this.getById(id, businessId);

        const updates = [];
        const values = [];

        if (data.name) { updates.push('name = ?'); values.push(data.name); }
        if (data.slug) { updates.push('slug = ?'); values.push(data.slug); }
        if (data.active !== undefined) { updates.push('active = ?'); values.push(data.active); }

        if (updates.length === 0) return await this.getById(id, businessId);

        values.push(id, businessId);
        
        const query = `UPDATE brands SET ${updates.join(', ')} WHERE id = ? AND business_id = ?`;
        await db.query(query, values);
        
        return await this.getById(id, businessId);
    }

    // Usaremos un Toggle Soft-Delete para no romper dependencias (FK)
    async toggleActive(id, businessId) {
        const brand = await this.getById(id, businessId);
        const newStatus = !brand.active;
        
        await db.query(
            'UPDATE brands SET active = ? WHERE id = ? AND business_id = ?',
            [newStatus, id, businessId]
        );
        
        return { success: true, message: `Marca ${newStatus ? 'activada' : 'desactivada'}`, active: newStatus };
    }
}

module.exports = new BrandsService();
