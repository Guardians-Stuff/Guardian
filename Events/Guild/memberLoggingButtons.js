const { ButtonInteraction, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isButton()) return

        const splitArray = interaction.customId.split("-")
        if (!splitArray[0] === "MemberLogging") return

        const member = (await interaction.guild.members.fetch()).get(splitArray[2])
        const Embed = new EmbedBuilder()
        const errorArray = []

        if (!interaction.member.permissions.has("KickMembers"))
            errorArray.push("You do not have the required permissions for this action.")

        if (!member)
            errorArray.push("This user is no longer in this server.")

        if (!member.moderatable)
            errorArray.push("This user cannot be moderated by the bot.")

        if (errorArray.length) return interaction.reply({
            embeds: [Embed.setDescription(errorArray.join("\n"))],
            ephemeral: true
        })
        switch (splitArray[1]) {
            case "Kick": {
                member.kick(`Kicked by: ${interaction.user.tag} | Member Logging System`).then(() => {
                    interaction.reply({ embeds: [Embed.setColor("Green").setDescription(`${member} has been kicked.`)] })
                }).catch(() => {
                    interaction.reply({ embeds: [Embed.setColor("Red").setDescription(`${member} couldn't be kicked.`)] })
                })
            }
                break;

            case "Ban": {
                member.ban(`Banned by: ${interaction.user.tag} | Member Logging System`).then(() => {
                    interaction.reply({ embeds: [Embed.setColor("Green").setDescription(`${member} has been banned.`)] })
                }).catch(() => {
                    interaction.reply({ embeds: [Embed.setColor("Red").setDescription(`${member} couldn't be banned.`)] })
                })
            }
                break;
        }
    }
}