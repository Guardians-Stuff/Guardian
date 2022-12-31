const Discord = require('discord.js')
const Mongoose = require('mongoose');

const ExpiringDocumentManager = require('./Classes/ExpiringDocumentManager');
const { loadEvents } = require('./Handlers/eventHandler');
const config = require('./config.json');

const Infractions = require('./Schemas/Infractions');

const client = new Discord.Client({
    intents: [ Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildMessages ],
    partials: [ Discord.Partials, Discord.Partials.Message, Discord.Partials.GuildMember, Discord.Partials.ThreadMember ]
});

client.commands = new Discord.Collection();
client.subCommands = new Discord.Collection();
client.expiringDocumentsManager = {
    infractions: new ExpiringDocumentManager(Infractions, 'expires', async (infraction) => {
        if (infraction.type == 'ban') {
            const guild = await client.guilds.fetch(infraction.guild).catch(() => null);
            if (guild) guild.members.unban(infraction.user, 'Temporary ban expired').catch(() => null);
        }

        infraction.active = false;
        await infraction.save();
    }, { active: true })
};

Mongoose.connect(config.DatabaseURL).then(async () => {
    console.log('Client is connected to the database.');

    await loadEvents(client);
    client.login(config.token).then(() => {
        client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
    });
});