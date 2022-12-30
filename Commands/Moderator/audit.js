const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('audit')
        .setDMPermission(false)
        .setDescription('Displays the audit log for the server')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ViewAuditLog)
        .addStringOption(option => option
            .setName('type')
            .setDescription('The type of audit log to display')
            .setChoices(
                { name: 'ban', value: Discord.AuditLogEvent.MemberBanAdd.toString() },
                { name: 'unban', value: Discord.AuditLogEvent.MemberBanRemove.toString() },
                { name: 'kick', value: Discord.AuditLogEvent.MemberKick.toString() },
                { name: 'message-delete', value: Discord.AuditLogEvent.MessageDelete.toString() },
                { name: 'message-delete-bulk', value: Discord.AuditLogEvent.MessageBulkDelete.toString() },
                { name: 'role-create', value: Discord.AuditLogEvent.RoleCreate.toString() },
                { name: 'role-delete', value: Discord.AuditLogEvent.RoleDelete.toString() },
                { name: 'role-update', value: Discord.AuditLogEvent.RoleUpdate.toString() },
                { name: 'channel-create', value: Discord.AuditLogEvent.ChannelCreate.toString() },
                { name: 'channel-delete', value: Discord.AuditLogEvent.ChannelDelete.toString() },
                { name: 'channel-update', value: Discord.AuditLogEvent.ChannelUpdate.toString() },
                { name: 'emoji-create', value: Discord.AuditLogEvent.EmojiCreate.toString() },
                { name: 'emoji-delete', value: Discord.AuditLogEvent.EmojiDelete.toString() },
                { name: 'emoji-update', value: Discord.AuditLogEvent.EmojiUpdate.toString() },
                { name: 'invite-create', value: Discord.AuditLogEvent.InviteCreate.toString() },
                { name: 'invite-delete', value: Discord.AuditLogEvent.InviteDelete.toString() },
                { name: 'webhook-create', value: Discord.AuditLogEvent.WebhookCreate.toString() },
                { name: 'webhook-delete', value: Discord.AuditLogEvent.WebhookDelete.toString() },
                { name: 'webhook-update', value: Discord.AuditLogEvent.WebhookUpdate.toString() },
                { name: 'member-update', value: Discord.AuditLogEvent.MemberUpdate.toString() },
                { name: 'member-move', value: Discord.AuditLogEvent.MemberMove.toString() },
            )
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to filter the audit log for')
        )
        .addIntegerOption(option => option
            .setName('limit')
            .setDescription('The amount of audit logs to display')
            .setMaxValue(5)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const user = interaction.options.getUser('user');
        const limit = interaction.options.getInteger('limit') || 5;

        const auditLogs = await interaction.guild.fetchAuditLogs({ limit: limit, type: type, user: user });
        if (auditLogs.entries.size === 0) return EmbedGenerator.errorEmbed('No audit logs found!');

        const description = [];

        for (const entry of auditLogs.entries.values()) {
            description.push(`**${Discord.AuditLogEvent[entry.action]}** | <@${entry.executor.id}> ${entry.target.username ? ` => <@${entry.target.id}>` : ''}`);
        }

        return EmbedGenerator.basicEmbed(description.join('\n'))
            .setAuthor({ name: 'Audit Logs' })
            .setTimestamp();
    }
};