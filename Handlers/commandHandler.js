const Discord = require('discord.js');
const ascii = require('ascii-table');

const { loadFiles } = require('../Functions/fileLoader');

async function loadCommands(client) {
    const table = new ascii().setHeading("Commands", "Status");
    const files = await loadFiles("Commands")
    let commandsArray = [];

    await client.commands.clear();
    await client.subCommands.clear();

    files.forEach(file => {
        const command = require(file);

        if(command.subCommands) for(const subcommand of command.subCommands) client.subCommands.set(`${command.data.name}.${subcommand.data.name}`, subcommand);
        if(command.data instanceof Discord.SlashCommandSubcommandBuilder) return;

        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());

        table.addRow(command.data.name, "✅");
    });

    client.application.commands.set(commandsArray)

    return console.log(table.toString(), "\nCommands Loaded.")
}

module.exports = { loadCommands }