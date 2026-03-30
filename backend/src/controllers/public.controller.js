const productsService = require('../services/products.service');
const categoriesService = require('../services/categories.service');
const settingsService = require('../services/settings.service');
const { DEFAULT_BUSINESS_ID } = require('../config/business.config');

class PublicController {
    /**
     * Obtener configuración pública del negocio.
     */
    getSettings = async (req, res, next) => {
        try {
            const settings = await settingsService.getSettings(DEFAULT_BUSINESS_ID);
            res.status(200).json({
                success: true,
                data: settings
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Obtener productos públicos: solo activos y visibles en web.
     */
    getProducts = async (req, res, next) => {
        try {
            // Reusamos el servicio getAll que ya tiene el join con categorías y marcas
            const allProducts = await productsService.getAll(DEFAULT_BUSINESS_ID);
            
            // Filtro estricto según requerimiento: activo=true y visible_en_web=true
            const publicProducts = allProducts.filter(p => !!p.activo && !!p.visible_en_web);
            
            res.status(200).json({
                success: true,
                count: publicProducts.length,
                data: publicProducts
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Obtener categorías públicas: solo las activas que pertenecen al negocio.
     */
    getCategories = async (req, res, next) => {
        try {
            const allCategories = await categoriesService.getAll(DEFAULT_BUSINESS_ID);
            const activeCategories = allCategories.filter(c => !!c.active);
            
            res.status(200).json({
                success: true,
                count: activeCategories.length,
                data: activeCategories
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Obtener un producto individual para el catálogo público.
     * Solo si es activo y visible en web.
     */
    getProductById = async (req, res, next) => {
        try {
            const product = await productsService.getById(req.params.id, DEFAULT_BUSINESS_ID);
            
            if (!product || !product.activo || !product.visible_en_web) {
                return res.status(404).json({
                    success: false,
                    error: 'Producto no disponible o inexistente'
                });
            }

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            // Si el servicio lanza "Producto no encontrado", devolvemos 404
            if (error.message === 'Producto no encontrado') {
                return res.status(404).json({ success: false, error: error.message });
            }
            next(error);
        }
    };
}

module.exports = new PublicController();
