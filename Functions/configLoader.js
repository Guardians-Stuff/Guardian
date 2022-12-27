const Guilds = require("../Schemas/Guilds")

async function loadConfig(client) {
    const guilds = await Guilds.find();
    guilds.forEach(guild => client.guildConfig.set(guild.guild, guild.toObject()));

    return console.log("Loaded Guild Configs to the Collection.")
}

module.exports = { loadConfig }