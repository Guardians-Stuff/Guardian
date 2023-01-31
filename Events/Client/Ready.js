const { Discord, ActivityType } = require('discord.js');

const index = require('../../index.js');
const config = require('../../config.json');
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

        if(config.live){
            process.on('uncaughtException', async e => console.log(e.stack || 'Unknown Error'));
            process.on('unhandledRejection', async e => console.log(e.stack || 'Unknown Rejection'));
        }

        index.server.listen(config.live ? 443 : 3001, () => console.log('The client is now ready.'));

        client.user.setPresence({
            activities: [{ name: `${client.guilds.cache.size} servers!`, type: ActivityType.Watching }],
            status: "online",
        });
    }
}