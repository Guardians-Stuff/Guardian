const {
    Perms
} = require("../Validation/Permissions")
const {
    Client, REST, Routes
} = require("discord.js")
const ms = require("ms")

module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Commands Loaded")

    let CommandsArray = []

    const CommandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandFiles.map(async (file) => {
        const command = require(file)

        if (!command.name) return Table.addRow(file.split("/")[7], "FAILED", "Missing a Name")
        if (!command.context && !command.description) return Table.addRow(command.name, "FAILED", "Missing a Description")
        if (command.UserPerms)
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "FAILED", "User Permissions is Invalid")

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        await Table.addRow(command.name, "SUCCESSFUL")
    })

    console.log(Table.toString())

    client.on("ready", async () => {

        setInterval(() => {
            client.guilds.cache.forEach(guild => {
                guild.commands.set(CommandsArray)
            })
        }, ms("5s"))
    });
}