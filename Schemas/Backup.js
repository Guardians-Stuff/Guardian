const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    backupId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Backup', backupSchema); //exports the backup schema as a model
