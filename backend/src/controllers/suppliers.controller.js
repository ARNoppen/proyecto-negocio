const suppliersService = require('../services/suppliers.service');

class SuppliersController {
    getAll = async (req, res, next) => {
        try {
            // El admin puede ver inactivos (por defecto)
            const data = await suppliersService.getAll(req.user.business_id, false);
            res.status(200).json({ success: true, count: data.length, data });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const data = await suppliersService.getById(req.params.id, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Proveedor no encontrado') error.statusCode = 404;
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ success: false, error: 'El nombre del proveedor es obligatorio' });
            }
            const data = await suppliersService.create(req.body, req.user.business_id);
            res.status(201).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const data = await suppliersService.update(req.params.id, req.body, req.user.business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Proveedor no encontrado') error.statusCode = 404;
            next(error);
        }
    };

    toggleActive = async (req, res, next) => {
        try {
            const data = await suppliersService.toggleActive(req.params.id, req.user.business_id);
            res.status(200).json(data);
        } catch (error) {
            if (error.message === 'Proveedor no encontrado') error.statusCode = 404;
            next(error);
        }
    };
}

module.exports = new SuppliersController();
