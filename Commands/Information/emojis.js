const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('emojis')
        .setDescription('Lists the number of animated and non-animated emojis in the server.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.EVERYONE)
        .setDMPermission(false),
    async execute(interaction, client, dbGuild) {
        const emojis = interaction.guild.emojis.cache;
        const animatedEmojis = emojis.filter((emoji) => emoji.animated);
        const nonAnimatedEmojis = emojis.filter((emoji) => !emoji.animated);

        const message = `Emoji Stats for ${interaction.guild.name}:\nTotal Emojis: ${emojis.size}\nAnimated Emojis: ${animatedEmojis.size}\nNon-Animated Emojis: ${nonAnimatedEmojis.size}`;

        await interaction.reply(message);
    },
};
