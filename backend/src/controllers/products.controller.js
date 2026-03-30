const productsService = require('../services/products.service');

class ProductsController {
    getAll = async (req, res, next) => {
        try {
            const data = await productsService.getAll(req.user.business_id);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const data = await productsService.getById(req.params.id, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Producto no encontrado') error.statusCode = 404;
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ success: false, error: 'El nombre del producto es obligatorio' });
            }
            const data = await productsService.create(req.body, req.user.business_id);
            res.status(201).json({ success: true, data });
        } catch (error) {
            // Manejar error de validación SQL como un 400 (ej: duplicate entry)
            if (error.code === 'ER_DUP_ENTRY') {
                error.statusCode = 400;
                error.message = 'El slug de este producto ya existe';
            }
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const data = await productsService.update(req.params.id, req.body, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                error.statusCode = 400;
                error.message = 'El slug de este producto ya existe';
            }
            if (error.message === 'Producto no encontrado') error.statusCode = 404;
            next(error);
        }
    };

    toggleActive = async (req, res, next) => {
        try {
            const data = await productsService.toggleActive(req.params.id, req.user.business_id);
            res.status(200).json(data);
        } catch (error) {
            if (error.message === 'Producto no encontrado') error.statusCode = 404;
            next(error);
        }
    };
}

module.exports = new ProductsController();
