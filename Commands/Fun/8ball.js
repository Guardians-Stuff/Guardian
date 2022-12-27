const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require("discord.js");

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the magic 8ball a question")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question you want to ask the magic 8ball")
                .setRequired(true)
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const question = interaction.options.getString("question");

        const options = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes - definitely.",
            "You may rely on it.",
            "No"
        ]

        const randomoption = options[Math.floor(Math.random() * options.length)];

        return EmbedGenerator.basicEmbed(`\`\`\`${question}\`\`\``)
            .setTitle(`8ball` + ` - ${interaction.user.username}`)
            .addFields(
                { name: 'Answer', value: `${randomoption}` },
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
    }
};