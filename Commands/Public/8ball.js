const { EmbedBuilder, MessageActionRow, MessageButton, MessageCollector, SlashCommandBuilder } = require("discord.js");
const axios = require("axios").default;
const wait = require("util").promisify(setTimeout);

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
    async execute(interaction) {

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

        const embed = new EmbedBuilder()
            .setTitle(`8ball` + ` - ${interaction.user.username}`)
            .setDescription(`\`\`\`${question}\`\`\``)
            .addFields(
                { name: 'Answer', value: `${randomoption}` },
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
        interaction.reply({ embeds: [embed] });

    },
};