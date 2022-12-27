const Discord = require('discord.js');

const { loadCommands } = require("../../Handlers/commandHandler")
const ExpiringDocumentManager = require('../../Classes/ExpiringDocumentManager');

const Infractions = require('../../Schemas/Infractions');

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Discord.Client} client 
     */
    async execute(client) {
        console.log("The client is now ready.")

        loadCommands(client)

        await client.expiringDocumentsManager.punishments.init();
    }
}