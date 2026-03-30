const db = require('../config/db');

class DashboardService {
    async getStats(businessId) {
        // Ejecutamos múltiples conteos en paralelo para optimizar
        const [
            categoriesCount,
            lowStockCount,
            featuredCount,
            promotionCount
        ] = await Promise.all([
            this.getCount('categories', businessId),
            this.getLowStockCount(businessId),
            this.getCount('products', businessId, 'AND destacado = TRUE'),
            this.getCount('products', businessId, 'AND en_promocion = TRUE')
        ]);

        return {
            totalCategories: categoriesCount,
            lowStockProducts: lowStockCount,
            featuredProducts: featuredCount,
            promotionProducts: promotionCount
        };
    }

    async getCount(table, businessId, extraWhere = '') {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM ${table} WHERE business_id = ? ${extraWhere}`,
            [businessId]
        );
        return rows[0].count;
    }

    /**
     * Lógica de Stock Bajo según requerimiento:
     * - Si tiene stock_minimo, usarlo como umbral.
     * - Si no, usar 10 como fallback.
     * - Solo contar si 0 < stock_actual < umbral.
     */
    async getLowStockCount(businessId) {
        const [rows] = await db.query(`
            SELECT COUNT(*) as count 
            FROM products 
            WHERE business_id = ? 
              AND activo = TRUE
              AND stock_actual >= 0 
              AND stock_actual <= COALESCE(NULLIF(stock_minimo, 0), 10)
        `, [businessId]);
        
        return rows[0].count;
    }
}

module.exports = new DashboardService();
