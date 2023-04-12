const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('disable')
        .setDescription('Disable the ticket system.'),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        dbGuild.tickets.enabled = false;
        dbGuild.tickets.category = null;
        dbGuild.tickets.channel = null;
        dbGuild.tickets.role = null;

        return EmbedGenerator.basicEmbed('🔓 | Ticket system has been disabled!');
    },
};
