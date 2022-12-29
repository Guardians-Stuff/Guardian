const Discord = require('discord.js');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("cat")
        .setDescription("Get a random cat image!"),
    /**
     * @param {Discord.ChatInputApplicationCommandData} interaction
     */
    async execute(interaction) {
        const embed = new Discord.EmbedBuilder()
            .setTitle("Meow!")
            .setImage(`https://cataas.com/cat?${Date.now()}`)
            .setColor("Blue")
            .setTimestamp()
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: `${interaction.user.displayAvatarURL()}`,
            });

        return embed;
    }
};