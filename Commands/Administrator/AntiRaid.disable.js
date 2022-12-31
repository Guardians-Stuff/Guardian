const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('disable')
        .setDescription('Disable the anti-raid protection system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        dbGuild.antiraid.enabled = false;
        dbGuild.antiraid.joinWithin = 2;
        dbGuild.antiraid.joinAmount = 20;
        dbGuild.antiraid.lockdown.enabled = true;
        dbGuild.antiraid.channel = null;
        dbGuild.antiraid.action = 'kick';

        return EmbedGenerator.basicEmbed('🔓 | Anti-raid protection has been disabled!');
    }
}