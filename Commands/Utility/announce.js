const { Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "announcement",
    description: "Announces something.",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    category: "Utility",

    async execute (interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId("announce-modal")
            .setTitle("Announcement")
            

        const messageInput = new TextInputBuilder()
            .setCustomId("message-input")
            .setLabel("Message")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Enter the announcement message")
            .setRequired(true)

        
        const Row = new ActionRowBuilder().addComponents(messageInput)

        modal.addComponents(Row)

        await interaction.showModal(modal)
    }
}
