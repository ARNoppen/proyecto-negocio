const db = require('../config/db');

class CategoriesService {
    async getAll(businessId) {
        const [rows] = await db.query(
            'SELECT * FROM categories WHERE business_id = ? ORDER BY name ASC',
            [businessId]
        );
        return rows;
    }

    async getById(id, businessId) {
        const [rows] = await db.query(
            'SELECT * FROM categories WHERE id = ? AND business_id = ?',
            [id, businessId]
        );
        
        if (rows.length === 0) {
            throw new Error('Categoría no encontrada');
        }
        
        return rows[0];
    }

    async create(data, businessId) {
        // Generar slug básico a partir del nombre si no viene
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const [result] = await db.query(
            'INSERT INTO categories (business_id, name, slug, description, active) VALUES (?, ?, ?, ?, ?)',
            [businessId, data.name, slug, data.description || null, data.active !== undefined ? data.active : true]
        );
        
        return { id: result.insertId, ...data, slug, business_id: businessId };
    }

    async update(id, data, businessId) {
        // Verificar si existe
        await this.getById(id, businessId);

        const updates = [];
        const values = [];

        if (data.name) { updates.push('name = ?'); values.push(data.name); }
        if (data.slug) { updates.push('slug = ?'); values.push(data.slug); }
        if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
        if (data.active !== undefined) { updates.push('active = ?'); values.push(data.active); }

        if (updates.length === 0) return await this.getById(id, businessId);

        values.push(id, businessId);
        
        const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ? AND business_id = ?`;
        await db.query(query, values);
        
        return await this.getById(id, businessId);
    }

    // Usaremos un Toggle Soft-Delete para no romper dependencias (FK)
    async toggleActive(id, businessId) {
        const category = await this.getById(id, businessId);
        const newStatus = !category.active;
        
        await db.query(
            'UPDATE categories SET active = ? WHERE id = ? AND business_id = ?',
            [newStatus, id, businessId]
        );
        
        return { success: true, message: `Categoría ${newStatus ? 'activada' : 'desactivada'}`, active: newStatus };
    }
}

module.exports = new CategoriesService();
