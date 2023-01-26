const { ChatInputCommandInteraction, SlashCommandBuilder, Client } = require("discord.js")

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crisis")
        .setDMPermission(false)
        .setDescription("Gives you global crisis hotlines!"),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        return EmbedGenerator.basicEmbed()
            .addFields([
                { name: "Suicide Hotline", value: `988`, inline: true },
                { name: "Drug Hotline", value: `1-844-289-0879`, inline: true },
                { name: "Child Abuse Hotline", value: `800-422-4453`, inline: true },
                { name: "ANAD", value: `630-577-1330`, inline: true },
                { name: "National Network Hotline", value: `1-800-656-4673`, inline: true },
                { name: "AIDS Hotline", value: `1-800-342-2473`, inline: true }
            ])
    }
}