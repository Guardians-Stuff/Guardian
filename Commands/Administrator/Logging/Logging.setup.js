const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('setup')
        .setDescription('Configure the logging system.')
        .addChannelOption(option => option
            .setName('log_channel')
            .setDescription('Select the basic logging channel for this system.')
            .addChannelTypes(Discord.ChannelType.GuildText)
            .setRequired(true)
        ).addChannelOption(option => option
            .setName('modlog_channel')
            .setDescription('Select the moderator logging channel for this system.')
            .addChannelTypes(Discord.ChannelType.GuildText)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const logChannel = interaction.options.getChannel('log_channel', true);
        const modLogChannel = interaction.options.getChannel('modlog_channel');

        dbGuild.logs.enabled = true;
        dbGuild.logs.basic = logChannel.id;
        dbGuild.logs.moderator = modLogChannel?.id;

        return EmbedGenerator.basicEmbed([
            '🔒 | The logging system has been enabled!',
            '',
            `• Basic Logging Channel Updated: <#${logChannel.id}>`,
            `• Moderator Logging Channel Updated: ${modLogChannel ? `<#${modLogChannel.id}>` : 'Not Specified.'}`,
        ].join("\n"));
    }
}