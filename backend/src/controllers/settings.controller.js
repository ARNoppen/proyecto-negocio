const settingsService = require('../services/settings.service');

class SettingsController {
    getSettings = async (req, res, next) => {
        try {
            const data = await settingsService.getSettings(req.user.business_id);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    };

    updateSettings = async (req, res, next) => {
        try {
            const data = await settingsService.updateBatch(req.user.business_id, req.body);
            res.json({ success: true, message: 'Configuraciones actualizadas', data });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new SettingsController();
