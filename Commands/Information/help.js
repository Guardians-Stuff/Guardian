const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

const requiredPerms = {
    type: "flags",
    key: [PermissionFlagsBits.SendMessages],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help from the bot")
        .addStringOption((option) =>
            option
                .setName("category")
                .setDescription("The category of the command to get help for")
                .addChoices(
                    { name: "Fun", value: "Fun" },
                    { name: "Giveaways", value: "Giveaways" },
                    { name: "Information", value: "Information" },
                    { name: "Moderation", value: "Moderator" },
                    { name: "Utility", value: "Utility" },
                    { name: "Admin", value: "Administrator" }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const category = interaction.options.getString("category");

        let commandArray = [];

        const inputs = {
            "8ball.js": "`[question]`",
            //"hack.js": "`[user]`",
            "quote.js": "`[category]`",
            "roll.js": "`(amount)`",
            "rps.js": "`[option1]`, `[option2]`, `[option3]`",
            "ban.js": "`[target]`, `(reason)`",
            //"history.js": "`[target]`",
            "kick.js": "`[target]`, `(reason)`",
            "mute.js": "`[target]`, [duration], `(reason)`",
            "purge.js": "`[amount]`",
            //"revoke.js": "`[target]`,`[caseId]`",
            "slowmode.js": "`[amount]`",
            "unban.js": "`[target]`",
            "unmute.js": "`[target]`",
            "warn.js": "`[target]`, `(reason)`",
            //"deletegiveaway.js": "`[messageId]`",
            //"endgiveaway.js": "`[messageId]`",
            //"giveaway.js": "`[prize]`, `[channel]`, `[time]`, `(winners)`",
            //"reroll.js": "`[messageId]`",
            "avatar.js": "`(target)`",
            //"rank.js": "`(target)`",
            "help.js": "`[category]`",
            "roleinfo.js": "`[role]`",
            "announce.js": "`[channel]`, `[message]`",
            //"poll.js": "`[channel]`, `[message]`, `[option1]`, `[option2]`, `etc...`",
        };

        const commandFiles = fs
            .readdirSync(`./Commands/${category}`)
            .filter((file) => file.endsWith(".js"));
        for (const file of commandFiles) {
            commandArray.push(`${file} ${inputs[file] ?? ""}`);
        }

        commandArray = commandArray.map(function (d) {
            return d.replace(".js", "");
        });

        const userDM = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle(`${category}`)
            .addFields({
                name: `Commands in ${category}`,
                value: commandArray.join("\n"),
                inline: false,
            })
            .setTimestamp();

        interaction.user
            .createDM(true)
            .catch((err) =>
                interaction.reply({ content: `An error occured: \`${err}\`` })
            );
        interaction.user
            .send({ embeds: [userDM] })
            .catch((err) =>
                interaction.reply({ content: `An error occured: \`${err}\`` })
            );
        interaction.reply({
            content: `Please check your Direct Messages!`,
            ephemeral: true,
        });
    },
    requiredPerms: requiredPerms,
};