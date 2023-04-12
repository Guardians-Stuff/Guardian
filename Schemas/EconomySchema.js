const mongoose = require('mongoose');

const economySchema = new mongoose.Schema({
    UserId: String,
    Bank: Number,
    Wallet: Number,
    NetWorth: Number,
    Multiplier: Number,
    Inventory: Array,
});

const model = mongoose.model('EconomySchema', economySchema);

module.exports = model;
