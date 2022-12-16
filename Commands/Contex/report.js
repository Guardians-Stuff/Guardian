const { Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/ReportsDB")//fix the paths accordingly
const ChannelDB = require("../../Structures/Schemas/reportChannel")//fix the paths accordingly

module.exports = {
    name: "Report",
    type: ApplicationCommandType.User,
    context: true,
    category: "Context",

    /**
     * @param { ContextMenuCommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {

        const { guild, targetId, user } = interaction

        const ReportedUser = guild.members.cache.get(targetId)
        const WhoReported = user.id

        const Embed = new EmbedBuilder()
            .setColor("Blue")

        if (WhoReported === ReportedUser.id) return interaction.reply({
            embeds: [Embed
                .setDescription("**You can't report yourself**")
                .setColor("DarkRed")
            ], ephemeral: true
        })

        if (guild.ownerId === ReportedUser.id) return interaction.reply({
            embeds: [Embed
                .setDescription("**You can't report the server owner**")
                .setColor("DarkRed")
            ], ephemeral: true
        })

        if (ReportedUser.user.bot) return interaction.reply({
            embeds: [Embed
                .setDescription("**You can't report a bot**")
                .setColor("DarkRed")
            ], ephemeral: true
        })

        /////Modal Part
        const modal = new ModalBuilder()
            .setCustomId("reportUser")
            .setTitle("Report User")

        const reasonInput = new TextInputBuilder()
            .setCustomId("report_reason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Enter the reason for reporting this user")
            .setMaxLength(1000)
            .setRequired(true)

        const Row = new ActionRowBuilder().addComponents(reasonInput)
        modal.addComponents(Row)
        /////Modal Part ended

        let Data = await DB.findOne({ Guild: guild.id, User: ReportedUser.id, ReportedBy: WhoReported })

        if (Data) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("DarkRed")
                    .setDescription(`You have already reported ${ReportedUser}!`)
                ], ephemeral: true
            })
        }
        else {

            await interaction.showModal(modal)
            const modalSubmitInteraction = interaction.awaitModalSubmit({ time: 1000 * 60 * 2 }).catch(async err => {
                if (err.code == "InteractionCollectorError") return
            })

            var reason = (await modalSubmitInteraction).fields.getTextInputValue("report_reason")
            if (!reason) return

            Data = new DB({
                Guild: guild.id,
                User: ReportedUser.id,
                ReportedBy: WhoReported,
                Reason: reason
            })

            await Data.save()

                ; (await modalSubmitInteraction).reply({
                    embeds: [Embed.setDescription(`Thank you for reporting ${ReportedUser}!`)], ephemeral: true
                })

        }

        const data = await DB.find({ Guild: guild.id, User: ReportedUser.id })// to check how many reports he have

        ////sending part

        const Channel = await ChannelDB.findOne({ Guild: guild.id})
        if (!Channel) return

        const logChannel = guild.channels.cache.get(Channel.Channel)
        if (!logChannel) return

        logChannel.send({
            embeds: [new EmbedBuilder()
                .setTitle(`⚠ | New user Reported!`)
                .setColor("Blue")
                .addFields(
                    { name: "Reported by", value: `${user}`, inline: true },
                    { name: "Total Reports", value: `${data.length}`, inline: true },
                    { name: "Reason", value: `${reason}`, inline: false },
                )
                .setDescription(`${ReportedUser} has been reported by ${user}`)
                .setThumbnail(ReportedUser.displayAvatarURL())
                .setFooter({ text: `ID: ${ReportedUser.id}` })
                .setTimestamp()
            ]
        })
    }
}