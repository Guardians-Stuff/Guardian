const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Ask the magic 8ball a question")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The question to ask")
                .setRequired(true)
        ),
    async execute(interaction) {
        eightballTxt = fs.readFileSync("./data/8ballresponses.txt");
        eightballTxt = eightballTxt.toString();
        eightballTxt = eightballTxt.split("\n");
        randomNum = Math.floor(Math.random() * 20);

        interaction.reply({
            content: `\`${interaction.options.getString("question")}\`\n:8ball: ${eightballTxt[randomNum]
                }`,
            ephemeral: true,
        });
    },
};