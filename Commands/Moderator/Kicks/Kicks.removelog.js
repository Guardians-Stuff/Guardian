const Discord = require('discord.js');

const EmbedGenerator = require('../../../Functions/embedGenerator');

const Infractions = require('../../../Schemas/Infractions');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('removelog')
        .setDescription('Removes a logged kick from a member of the discord.')
        .addUserOption((option) =>
            option
                .setName(`user`)
                .setDescription(`The user you'd like to remove a kick from.`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('kick')
                .setDescription('The kick you\'d like to remove, alternatively "all" or "latest".')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('user', true);

        const kick = interaction.options.getString('kick', true);
        if (kick === 'all') {
            await Infractions.deleteMany({
                guild: interaction.guild.id,
                user: user.id,
                type: 'kick',
            });

            return EmbedGenerator.basicEmbed('All kicks removed');
        }

        const kicks = await Infractions.find({
            guild: interaction.guild.id,
            user: user.id,
            type: 'kick',
        }).sort({ time: -1 });
        if (kicks.length === 0)
            return { embeds: [EmbedGenerator.errorEmbed('No kicks found')], ephemeral: true };

        if (kick === 'latest') {
            await kicks[0].remove();

            return EmbedGenerator.basicEmbed('Kick removed');
        } else {
            if (isNaN(+kick) || !kicks[+kick - 1])
                return { embeds: [EmbedGenerator.errorEmbed('Kick not found')], ephemeral: true };

            await kicks[+kick - 1].remove();

            return EmbedGenerator.basicEmbed('Kick removed');
        }
    },
};
