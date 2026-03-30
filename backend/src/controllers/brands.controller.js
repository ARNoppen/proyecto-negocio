const brandsService = require('../services/brands.service');

class BrandsController {
    getAll = async (req, res, next) => {
        try {
            const data = await brandsService.getAll(req.user.business_id);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const data = await brandsService.getById(req.params.id, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Marca no encontrada') error.statusCode = 404;
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ success: false, error: 'El nombre de la marca es obligatorio' });
            }
            const data = await brandsService.create(req.body, req.user.business_id);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const data = await brandsService.update(req.params.id, req.body, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Marca no encontrada') error.statusCode = 404;
            next(error);
        }
    };

    toggleActive = async (req, res, next) => {
        try {
            const data = await brandsService.toggleActive(req.params.id, req.user.business_id);
            res.status(200).json(data);
        } catch (error) {
            if (error.message === 'Marca no encontrada') error.statusCode = 404;
            next(error);
        }
    };
}

module.exports = new BrandsController();
