const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Emit the guildMemberAdd/Remove events.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),

    execute(interaction, client) {
        client.emit("guildMemberRemove", interaction.member)

        interaction.reply({ content: "Emitted GuildMemberRemove", ephemeral: true })
    }
}