const { Client, Partials, Collection } = require("discord.js")
const ms = require("ms")
const {  promisify } = require("util")
const { glob } = require("glob")
const PG = promisify(glob)
const Ascii = require("ascii-table")
require("dotenv").config()
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials

const client = new Client({
    intents: 131071,
    partials: [Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent],
    allowedMentions: { parse: ["everyone", "roles", "users"] },
    rest: { timeout: ms("1m") }
})

client.color = "Aqua"
client.commands = new Collection()

const Handlers = ["Events", "Commands", "Errors"]

Handlers.forEach(handler => {

    require(`./Handlers/${handler}`)(client, PG, Ascii)
})

module.exports = client 

client.login(process.env.TOKEN)