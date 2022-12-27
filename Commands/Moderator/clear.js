// COMMAND UNDER CONSTRUCTION

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, Client } = require("discord.js")
const Transcripts = require("discord-html-transcripts")

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Bulk delete messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .addNumberOption(options => options
            .setName("amount")
            .setDescription("Amount of messages you want deleted.")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Provide a valid reason.")
            .setRequired(true)
        )
        .addUserOption(options => options
            .setName("target")
            .setDescription("Provide a target.")
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const Amount = interaction.options.getNumber("amount")
        const Reason = interaction.options.getString("reason")
        const Target = interaction.options.getUser("target")

        const channelMessages = await interaction.channel.messages.fetch()
        const logChannel = interaction.guild.channels.cache.get("1056720695167569961")

        const responseEmbed = new EmbedBuilder().setColor("DarkBlue")
        const logEmbed = new EmbedBuilder().setColor("DarkAqua")
            .setAuthor({ name: "CLEAR COMMAND USED" })

        let logEmbedDescription = [
            `- Moderator: ${interaction.member}`,
            `- Target: ${Target || "None"}`,
            `- Channel: ${interaction.channel}`,
            `- Reason: ${Reason}`
        ]

        if (Target) {
            let i = 0
            let messagesToDelete = []
            channelMessages.filter((message) => {
                if (message.author.id === Target.id && Amount > i) {
                    messagesToDelete.push(message)
                    i++
                }
            })

            const Transcript = Transcripts.generateFromMessages(messagesToDelete, interaction.channel)

            interaction.channel.bulkDelete(messagesToDelete, true).then((messages) => {
                interaction.reply({
                    embeds: [responseEmbed.setDescription(`Cleared \`${messages.size}\` messages from ${Target}`)],
                    ephemeral: true
                })

                logEmbedDescription.push(`- Total Messages: ${messages.size}`)
                logChannel.send({
                    embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
                    files: [Transcript]
                })
            })
        } else {
            const Transcript = await Transcripts.createTranscript(interaction.channel, { limit: Amount })

            interaction.channel.bulkDelete(Amount, true).then((messages) => {
                interaction.reply({
                    embeds: [responseEmbed.setDescription(`Cleared \`${messages.size}\` messages.`)],
                    ephemeral: true
                })

                logEmbedDescription.push(`- Total Messages: ${messages.size}`)
                logChannel.send({
                    embeds: [logEmbed.setDescription(logEmbedDescription.join("\n"))],
                    files: [Transcript]
                })
            })
        }
    }
} 