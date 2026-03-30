const db = require('../config/db');

class SettingsService {
    async getSettings(businessId) {
        const [rows] = await db.query(
            'SELECT setting_key, setting_value FROM settings WHERE business_id = ?',
            [businessId]
        );
        
        // Convert array to object for easier use
        const settings = {};
        rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        
        // Also get business basic info
        const [biz] = await db.query('SELECT name, whatsapp FROM businesses WHERE id = ?', [businessId]);
        if (biz.length > 0) {
            settings.business_name = biz[0].name;
            settings.whatsapp_number = biz[0].whatsapp;
        }

        return settings;
    }

    async updateSetting(businessId, key, value) {
        // Special case for business table fields
        if (key === 'business_name') {
            await db.query('UPDATE businesses SET name = ? WHERE id = ?', [value, businessId]);
            return { success: true };
        }
        if (key === 'whatsapp_number') {
            await db.query('UPDATE businesses SET whatsapp = ? WHERE id = ?', [value, businessId]);
            return { success: true };
        }

        // Standard settings table
        await db.query(
            'INSERT INTO settings (business_id, setting_key, setting_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [businessId, key, value, value]
        );
        return { success: true };
    }

    async updateBatch(businessId, settingsObj) {
        for (const [key, value] of Object.entries(settingsObj)) {
            await this.updateSetting(businessId, key, value);
        }
        return { success: true };
    }
}

module.exports = new SettingsService();
