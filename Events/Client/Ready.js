const { Discord, ActivityType } = require('discord.js');

const { loadCommands } = require('../../Handlers/commandHandler');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client 
     */
    async execute(client) {
        await loadCommands(client);
        await client.expiringDocumentsManager.infractions.init();
        await client.expiringDocumentsManager.giveaways.init();
        await client.expiringDocumentsManager.reminders.init();

        console.log("The client is now ready.")

        client.user.setPresence({
            activities: [{ name: `${client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
            status: "online",
        });
    }
}