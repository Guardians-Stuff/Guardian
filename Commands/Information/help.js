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
                    //{ name: "Giveaways", value: "Giveaways" },
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
            "setup.js": "`No Input`",
            "SetupMemberLog.js": "`[log_channel]`, `[member_role]`, `[bot_role]`",
            "Setupverification.js": "`[type]`, `[role]`, `[channel]`",
            "8ball.js": "`[question]`",
            "cat.js": "`No Input`",
            "coinflip.js": "`No Input`",
            "dice.js": "`[sides]`",
            "help.js": "`[category]`",
            "invite.js": "`No Input`",
            "ping.js": "`No Input`",
            "stats.js": "`No Input`",
            "support.js": "`No Input`",
            "uptime.js": "`No Input`",
            "userinfo.js": "`No Input`",
            "announce.js": "`[channel]`, `[message]`",
            "audit.js": "`[type]`, `[user]`, `[limit]`",
            "ban.js": "`[user]`, `[delete_messages]`, `[reason]`",
            "bans.js": "`[user]`",
            "clear.js": "`[amount]`, `[reason]`, `[target]`",
            "kick.js": "`[user]`, `[reason]`",
            "kicks.js": "`[user]`",
            "lockdown.js": "`[reason]`",
            "removeban.js": "`[user]`, `[ban]`",
            "removekick.js": "`[user]`, `[kick]`",
            "removetimeout.js": "`[user]`, `[timeout]`",
            "removewarn.js": "`[user]`, `[warn]`",
            "slowmode.js": "`[duration]`, `[reason]`",
            "tempban.js": "`[user]`, `[duration]`, `[delete_messages]`, `[reason]`",
            "timeout.js": "`[target]`, `[duration]`, `[reason]`",
            "timeouts.js": "`[user]`",
            "unban.js": "`[user]`, `[reason]`",
            "unlock.js": "`[reason]`",
            "warn.js": "`[user]`, `[reason]`",
            "warns.js": "`[user]`",
            "avatar.js": "`[user]`"
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