const {
    PermissionFlagsBits,
    AuditLogEvent,
    EmbedBuilder,
    SlashCommandBuilder
} = require("discord.js");
const EmbedGenerator = require('../../Functions/embedGenerator');


const requiredPerms = {
    type: "flags",
    key: [
        PermissionFlagsBits.ViewAuditLog,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks,
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("audit")
        .setDescription(
            "Displays the audit log for the server, for you lazy people"
        )
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription(
                    "The type of audit log to display, seperated by dashes (ex: channel-create)"
                )
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to filter the audit log for")
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName("limit")
                .setDescription("The amount of audit logs to display")
                .setRequired(false)
                .setMaxValue(5)
        ),
    async execute(interaction) {
        const type = interaction.options.getString("type") ?? null;
        const user = interaction.options.getUser("user") ?? null;
        const limit = interaction.options.getInteger("limit") ?? 5;

        if (!interaction.member.permissions.has(requiredPerms.key))
            return interaction.reply({
                content: ":wrench: You do not have permission to use this command!",
                ephemeral: true,
            });

        if (!interaction.guild.members.me.permissions.has(requiredPerms.key)) {
            return interaction.reply({
                content: ":wrench: I do not have the `VIEWAUDITLOG` permission!",
                ephemeral: true,
            });
        }

        const auditLogTypes = {
            "ban": AuditLogEvent.MemberBanAdd,
            "unban": AuditLogEvent.MemberBanRemove,
            "kick": AuditLogEvent.MemberKick,
            "message-delete": AuditLogEvent.MessageDelete,
            "message-delete-bulk": AuditLogEvent.MessageBulkDelete,
            "role-create": AuditLogEvent.RoleCreate,
            "role-delete": AuditLogEvent.RoleDelete,
            "role-update": AuditLogEvent.RoleUpdate,
            "channel-create": AuditLogEvent.ChannelCreate,
            "channel-delete": AuditLogEvent.ChannelDelete,
            "channel-update": AuditLogEvent.ChannelUpdate,
            "emoji-create": AuditLogEvent.EmojiCreate,
            "emoji-delete": AuditLogEvent.EmojiDelete,
            "emoji-update": AuditLogEvent.EmojiUpdate,
            "invite-create": AuditLogEvent.InviteCreate,
            "invite-delete": AuditLogEvent.InviteDelete,
            "webhook-create": AuditLogEvent.WebhookCreate,
            "webhook-delete": AuditLogEvent.WebhookDelete,
            "webhook-update": AuditLogEvent.WebhookUpdate,
            "member-update": AuditLogEvent.MemberUpdate,
            "member-move": AuditLogEvent.MemberMove,
        };

        const auditLogs = await interaction.guild.fetchAuditLogs({
            limit: limit,
            type: type ? auditLogTypes[type] : null,
            user: user,
        });

        let replyEmbed = new EmbedBuilder()
            .setTitle("Audit Log")
            .setColor("#FF0000")
            .setTimestamp();

        if (auditLogs.entries.size === 0) {
            replyEmbed.setDescription("No audit logs found!");
            return interaction.reply({ embeds: [replyEmbed] });
        }

        for (i = 0; i < auditLogs.entries.size; i++) {
            const auditLog = auditLogs.entries.at(i);
            const { executor, target, targetType, actionType } = auditLog;

            if (target.username !== undefined) {
                replyEmbed.addFields({
                    name: `${targetType + " " + actionType}`,
                    value: `\`\`\`ini\nExecutor = '${executor.username}'\nTarget = '${target.username}#${target.discriminator}'\`\`\``,
                    inline: false,
                });
            } else {
                replyEmbed.addFields({
                    name: `${targetType + " " + actionType}`,
                    value: `\`\`\`ini\nExecutor = '${executor.username}'\`\`\``,
                    inline: false,
                });
            }
        }
        interaction.reply({ embeds: [replyEmbed], ephemeral: true });
    },
    requiredPerms: requiredPerms,
};