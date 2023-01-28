const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("hack")
        .setDescription("Hacks a user (fake)")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("user to target")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("target");

        if (user.bot) {
            return interaction.reply({
                content: ":wrench: You can't hack bots!",
                ephemeral: true,
            });
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: ":wrench: Did you just try to hack yourself?!",
                ephemeral: true,
            });
        }
        await interaction.reply({
            content: `:computer: Hacking <@${user.id}>...`,
        });

        emailTxt = fs.readFileSync("./data/hackdocs/emailextensions.txt");
        emailTxt = emailTxt.toString();
        emailTxt = emailTxt.split("\n");
        passwordsTxt = fs.readFileSync("./data/hackdocs/passwords.txt");
        passwordsTxt = passwordsTxt.toString();
        passwordsTxt = passwordsTxt.split("\n");
        randomNum = Math.floor(Math.random() * 100);

        const randomEmail = emailTxt[randomNum];
        const randomPassword = passwordsTxt[randomNum];

        const username = user.username;

        replyArray = [
            ":e_mail: Finding email... `12,5%`",
            `:e_mail: Email found! \`${username.replace(
                /\s/g,
                ""
            )}${randomEmail}\` \`25%\``,
            ":asterisk: Finding password... `37,5%`",
            `:asterisk: Password found! \`${randomPassword}\` \`50%\``,
            ":keyboard: Logging in... `62,5%`",
            ":keyboard: Logged in! `75%`",
            ":money_with_wings: Finding bank details... `86,5%`",
            `:money_with_wings: Bank details found! Email: \`${(username.replace(/\s/g, ""), randomEmail)
            }\` Password: \`${randomPassword}\` \`100%\``,
            `:computer: <@${user.id}> has been hacked!`,
        ];
        let i = 0;
        let replyInterval = await setInterval(() => {
            if (i < replyArray.length) {
                let editReplyMessage = [replyArray[i]];
                editReplyMessage = editReplyMessage.toString();
                interaction.editReply({
                    content: editReplyMessage,
                });
                i++;
            } else {
                clearInterval(replyInterval);
            }
        }, 2500);
    },
};