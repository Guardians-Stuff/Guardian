const Discord = require('discord.js');
const EmbedGenerator = require('../../Functions/embedGenerator');
const Guilds = require('../../Schemas/Guilds');

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
     */
    async execute(interaction, client) {
        const logChannel = interaction.options.getChannel('log_channel');
        const memberRole = interaction.options.getRole('member_role');
        const botRole = interaction.options.getRole('bot_role');

        const guild = await Guilds.findOneAndUpdate({ guild: interaction.guild.id }, { $set: { 'logs.basic': logChannel.id, 'autorole.member': memberRole.id, 'autorole.bot': botRole.id } }, { upsert: true, new: true });
        client.guildConfig.set(interaction.guild.id, guild.toObject());

        return EmbedGenerator.basicEmbed([
            `- Logging Channel Updated: <#${logChannel.id}>`,
            `- Member Auto-Role Updated: ${memberRole ? `<@&${memberRole.id}>` : 'Not Specified.'}`,
            `- Bot Auto-Role Updated: ${botRole ? `<@&${botRole.id}>` : 'Not Specified.'}`
        ].join("\n"));
    }
}