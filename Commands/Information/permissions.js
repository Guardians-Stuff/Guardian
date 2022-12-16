const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
module.exports = {
    name: "permissions",
    description: "Displays the permissions of a member",
    category: "Information",
    options: [
        {
            name: "user",
            description: "Select the user",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { options } = interaction
        const Member = options.getMember("user")
        const USER = options.getUser("user")

        let Embed = new EmbedBuilder()
            .setColor("DarkRed")

        if (!Member) return interaction.reply({
            embeds: [Embed
                .setDescription("The member couldn't be found")
            ], ephemeral: true
        })

        const PermsEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`🛠 | Permissions`)
            .setDescription(`Permissions of ${Member}\`\`\`CreateInstantInvite ${Member.permissions.has([PermissionFlagsBits.CreateInstantInvite]) ? "✅" : "❌"}\
            \nKickMembers ${Member.permissions.has([PermissionFlagsBits.KickMembers]) ? "✅" : "❌"}\
            \nBanMember ${Member.permissions.has([PermissionFlagsBits.BanMembers]) ? "✅" : "❌"}\
            \nAdministrator ${Member.permissions.has([PermissionFlagsBits.Administrator]) ? "✅" : "❌"}\
            \nManageChannels ${Member.permissions.has([PermissionFlagsBits.ManageChannels]) ? "✅" : "❌"}\
            \nManageGuild ${Member.permissions.has([PermissionFlagsBits.ManageGuild]) ? "✅" : "❌"}\
            \nAddReactions ${Member.permissions.has([PermissionFlagsBits.AddReactions]) ? "✅" : "❌"}\
            \nViewAuditLog ${Member.permissions.has([PermissionFlagsBits.ViewAuditLog]) ? "✅" : "❌"}\
            \nPrioritySpeaker ${Member.permissions.has([PermissionFlagsBits.PrioritySpeaker]) ? "✅" : "❌"}\
            \nStream ${Member.permissions.has([PermissionFlagsBits.Stream]) ? "✅" : "❌"}\
            \nViewChannel ${Member.permissions.has([PermissionFlagsBits.ViewChannel]) ? "✅" : "❌"}\
            \nSendMessages ${Member.permissions.has([PermissionFlagsBits.SendMessages]) ? "✅" : "❌"}\
            \nSendTTSMessages ${Member.permissions.has([PermissionFlagsBits.SendTTSMessages]) ? "✅" : "❌"}\
            \nManageMessages ${Member.permissions.has([PermissionFlagsBits.ManageMessages]) ? "✅" : "❌"}\
            \nEmbedLinks ${Member.permissions.has([PermissionFlagsBits.EmbedLinks]) ? "✅" : "❌"}\
            \nAttachFiles ${Member.permissions.has([PermissionFlagsBits.AttachFiles]) ? "✅" : "❌"}\
            \nReadMessageHistory ${Member.permissions.has([PermissionFlagsBits.ReadMessageHistory]) ? "✅" : "❌"}\
            \nMentionEveryone ${Member.permissions.has([PermissionFlagsBits.MentionEveryone]) ? "✅" : "❌"}\
            \nUseExternalEmojis ${Member.permissions.has([PermissionFlagsBits.UseExternalEmojis]) ? "✅" : "❌"}\
            \nViewGuildInsights ${Member.permissions.has([PermissionFlagsBits.ViewGuildInsights]) ? "✅" : "❌"}\
            \nConnect ${Member.permissions.has([PermissionFlagsBits.Connect]) ? "✅" : "❌"}\
            \nSpeak ${Member.permissions.has([PermissionFlagsBits.Speak]) ? "✅" : "❌"}\
            \nMuteMembers ${Member.permissions.has([PermissionFlagsBits.MuteMembers]) ? "✅" : "❌"}\
            \nDeafenMembers ${Member.permissions.has([PermissionFlagsBits.DeafenMembers]) ? "✅" : "❌"}\
            \nMoveMembers ${Member.permissions.has([PermissionFlagsBits.MoveMembers]) ? "✅" : "❌"}\
            \nUseVAD ${Member.permissions.has([PermissionFlagsBits.UseVAD]) ? "✅" : "❌"}\
            \nChangeNickname ${Member.permissions.has([PermissionFlagsBits.ChangeNickname]) ? "✅" : "❌"}\
            \nManageNicknames ${Member.permissions.has([PermissionFlagsBits.ManageNicknames]) ? "✅" : "❌"}\
            \nManageRoles ${Member.permissions.has([PermissionFlagsBits.ManageRoles]) ? "✅" : "❌"}\
            \nManageWebhooks ${Member.permissions.has([PermissionFlagsBits.ManageWebhooks]) ? "✅" : "❌"}\
            \nManageEmojisAndStickers ${Member.permissions.has([PermissionFlagsBits.ManageEmojisAndStickers]) ? "✅" : "❌"}\
            \nUseApplicationCommands ${Member.permissions.has([PermissionFlagsBits.UseApplicationCommands]) ? "✅" : "❌"}\
            \nRequestToSpeak ${Member.permissions.has([PermissionFlagsBits.RequestToSpeak]) ? "✅" : "❌"}\
            \nManageEvents ${Member.permissions.has([PermissionFlagsBits.ManageEvents]) ? "✅" : "❌"}\
            \nManageThreads ${Member.permissions.has([PermissionFlagsBits.ManageThreads]) ? "✅" : "❌"}\
            \nCreatePublicThreads ${Member.permissions.has([PermissionFlagsBits.CreatePublicThreads]) ? "✅" : "❌"}\
            \nCreatePrivateThreads ${Member.permissions.has([PermissionFlagsBits.CreatePrivateThreads]) ? "✅" : "❌"}\
            \nUseExternalStickers ${Member.permissions.has([PermissionFlagsBits.UseExternalStickers]) ? "✅" : "❌"}\
            \nSendMessagesInThreads ${Member.permissions.has([PermissionFlagsBits.SendMessagesInThreads]) ? "✅" : "❌"}\
            \nUseEmbeddedActivities ${Member.permissions.has([PermissionFlagsBits.UseEmbeddedActivities]) ? "✅" : "❌"}\
            \nModerateMembers ${Member.permissions.has([PermissionFlagsBits.ModerateMembers]) ? "✅" : "❌"}\
            \n\`\`\``)
            .setFooter({ text: `${USER.tag}`, iconURL: Member.displayAvatarURL() })
            .setTimestamp()
        return interaction.reply({ embeds: [PermsEmbed] })
    }
}