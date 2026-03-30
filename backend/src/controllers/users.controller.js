const usersService = require('../services/users.service');

class UsersController {
    getAll = async (req, res, next) => {
        try {
            // Requerimos business_id del usuario autenticado
            const { business_id } = req.user;
            const data = await usersService.getAll(business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const { business_id } = req.user;
            const data = await usersService.getById(req.params.id, business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') error.statusCode = 404;
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const { business_id } = req.user;
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ success: false, error: 'Nombre, email y contraseña son obligatorios' });
            }
            // El nuevo usuario hereda el business_id de quien lo crea
            const data = await usersService.create(req.body, business_id);
            res.status(201).json({ success: true, data });
        } catch (error) {
            if (error.message === 'El email ya está en uso') error.statusCode = 400;
            if (error.message.includes('business_id es requerido')) error.statusCode = 500;
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { business_id } = req.user;
            const data = await usersService.update(req.params.id, req.body, business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') error.statusCode = 404;
            if (error.message === 'El email ya está en uso') error.statusCode = 400;
            next(error);
        }
    };

    toggleActive = async (req, res, next) => {
        try {
            const { business_id } = req.user;
            const data = await usersService.toggleActive(req.params.id, business_id);
            res.status(200).json({ success: true, data });
        } catch (error) {
            if (error.message === 'Usuario no encontrado') error.statusCode = 404;
            next(error);
        }
    };
}

module.exports = new UsersController();
