const authService = require('../services/auth.service');

class AuthController {
    // Definimos los métodos como arrow functions para no perder el contexto 'this' (aunque no lo necesitemos mucho acá)
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Por favor, proporcione un email y contraseña' });
            }

            const data = await authService.login(email, password);
            
            res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            // Manejo de errores específicos para Auth
            if (error.message === 'Credenciales inválidas') {
                error.statusCode = 401;
            }
            next(error); // Pasa al errorHandler global
        }
    };

    getMe = async (req, res, next) => {
        try {
            // 'req.user' ya fue inyectado por el middleware 'protect'
            res.status(200).json({
                success: true,
                data: req.user
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController();
