const categoriesService = require('../services/categories.service');

class CategoriesController {
    getAll = async (req, res, next) => {
        try {
            // business_id se obtiene del JWT decodificado en req.user
            const businessId = req.user.business_id; 
            const data = await categoriesService.getAll(businessId);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const data = await categoriesService.getById(req.params.id, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Categoría no encontrada') error.statusCode = 404;
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ success: false, error: 'El nombre de la categoría es obligatorio' });
            }
            const data = await categoriesService.create(req.body, req.user.business_id);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const data = await categoriesService.update(req.params.id, req.body, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Categoría no encontrada') error.statusCode = 404;
            next(error);
        }
    };

    toggleActive = async (req, res, next) => {
        try {
            const data = await categoriesService.toggleActive(req.params.id, req.user.business_id);
            res.status(200).json(data);
        } catch (error) {
            if (error.message === 'Categoría no encontrada') error.statusCode = 404;
            next(error);
        }
    };
}

module.exports = new CategoriesController();
