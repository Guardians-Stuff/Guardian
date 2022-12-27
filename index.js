const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials

const ExpiringDocumentManager = require('./Classes/ExpiringDocumentManager');

const Infractions = require('./Schemas/Infractions');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember]
})

const { loadEvents } = require("./Handlers/eventHandler")

client.config = require("./config.json")
client.events = new Collection()
client.subCommands = new Collection()
client.commands = new Collection()
client.guildConfig = new Collection()
client.expiringDocumentsManager = {
    punishments: new ExpiringDocumentManager(Infractions, 'expires', async (infraction) => {
        if (infraction.type == 'ban') {
            const guild = await client.guilds.fetch(infraction.guild).catch(() => null);
            if (guild) guild.members.unban(infraction.user, 'Temporary ban expired').catch(() => null);
        }

        infraction.active = false;
        await infraction.save();
    }, { active: true })
};

const { connect } = require("mongoose")
connect(client.config.DatabaseURL, {
}).then(() => console.log("Client is connected to the database."))

loadEvents(client)

const { loadConfig } = require("./Functions/configLoader")
loadConfig(client)

client
    .login(client.config.token)
    .then(() => {
        client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
        //client.user.setActivity(`Bot is down! V2 coming soon!`)
    })