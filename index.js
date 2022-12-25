const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits
const { User, Message, GuildMember, ThreadMember } = Partials

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

const { connect } = require("mongoose")
connect(client.config.DatabaseURL, {
}).then(() => console.log("Client is connected to the database."))

loadEvents(client)

const { loadConfig } = require("./Functions/configLoader")
loadConfig(client)

client
    .login(client.config.token)
    .then(() => {
        //client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
        client.user.setActivity(`Bot is down! V2 coming soon!`)
    })