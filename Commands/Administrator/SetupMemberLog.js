const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setup_memberlog')
        .setDescription('Config the member logging system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addChannelOption((options) => options
            .setName('log_channel')
            .setDescription('Select the logging channel for this system.')
            .addChannelTypes(Discord.ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((options) => options
            .setName('member_role')
            .setDescription('Select the autorole for new members.')
        )
        .addRoleOption((options) => options
            .setName('bot_role')
            .setDescription('Select the autorole for bots.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const logChannel = interaction.options.getChannel('log_channel', true);
        const memberRole = interaction.options.getRole('member_role');
        const botRole = interaction.options.getRole('bot_role');

        dbGuild.logs.basic = logChannel.id;
        dbGuild.autorole.member = memberRole?.id;
        dbGuild.autorole.bot = memberRole?.id;

        return EmbedGenerator.basicEmbed([
            `• Logging Channel Updated: <#${logChannel.id}>`,
            `• Member Auto-Role Updated: ${memberRole ? `<@&${memberRole.id}>` : 'Not Specified.'}`,
            `• Bot Auto-Role Updated: ${botRole ? `<@&${botRole.id}>` : 'Not Specified.'}`
        ].join("\n"));
    }
}