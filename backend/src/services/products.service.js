const db = require('../config/db');

class ProductsService {
    async getAll(businessId) {
        // Obtenemos productos con nombres de categoría, marca y proveedor
        const query = `
            SELECT p.*, c.name as category_name, b.name as brand_name, s.name as supplier_name, s.phone as supplier_phone
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.business_id = ?
            ORDER BY p.name ASC
        `;
        const [rows] = await db.query(query, [businessId]);
        return rows;
    }

    async getById(id, businessId) {
        const query = `
            SELECT p.*, c.name as category_name, b.name as brand_name, s.name as supplier_name, s.phone as supplier_phone
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            WHERE p.id = ? AND p.business_id = ?
        `;
        const [rows] = await db.query(query, [id, businessId]);
        
        if (rows.length === 0) {
            throw new Error('Producto no encontrado');
        }
        
        const [images] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [id]);
        return { ...rows[0], images };
    }

    async create(data, businessId) {
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        const [result] = await db.query(
            `INSERT INTO products (
                business_id, category_id, brand_id, supplier_id, 
                name, slug, short_description, full_description, 
                price, stock_actual, stock_minimo, visible_en_web, destacado, en_promocion, custom_label, activo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                businessId, data.category_id || null, data.brand_id || null, data.supplier_id || null,
                data.name, slug, data.short_description || null, data.full_description || null,
                data.price || 0, data.stock_actual || 0, data.stock_minimo || 0, 
                data.visible_en_web !== undefined ? data.visible_en_web : true,
                data.destacado || false, data.en_promocion || false, data.custom_label || null,
                data.activo !== undefined ? data.activo : true
            ]
        );
        
        return await this.getById(result.insertId, businessId);
    }

    async update(id, data, businessId) {
        await this.getById(id, businessId);

        const updates = [];
        const values = [];

        const fields = [
            'category_id', 'brand_id', 'supplier_id', 'name', 'slug',
            'short_description', 'full_description', 'price', 
            'stock_actual', 'stock_minimo', 'visible_en_web', 
            'destacado', 'en_promocion', 'custom_label', 'activo'
        ];

        fields.forEach(field => {
            if (data[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (updates.length === 0) return await this.getById(id, businessId);

        values.push(id, businessId);
        
        await db.query(
            `UPDATE products SET ${updates.join(', ')} WHERE id = ? AND business_id = ?`,
            values
        );
        
        return await this.getById(id, businessId);
    }

    async toggleActive(id, businessId) {
        const product = await this.getById(id, businessId);
        const newStatus = !product.activo;
        
        await db.query(
            'UPDATE products SET activo = ? WHERE id = ? AND business_id = ?',
            [newStatus, id, businessId]
        );
        
        return { success: true, message: `Producto ${newStatus ? 'activado' : 'desactivado'}`, activo: newStatus };
    }
}

module.exports = new ProductsService();
