const Discord = require('discord.js');
const Moment = require('moment');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Giveaways = require('../../Schemas/Giveaways');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'giveaway') return;

        let giveaway = await Giveaways.findOne({ giveaway: interaction.message.id });
        if (!giveaway) return interaction.reply({ embeds: [EmbedGenerator.errorEmbed()] });
        if (!giveaway.active) {
            await interaction.update({ components: [] });
            return interaction.followUp({
                embeds: [EmbedGenerator.errorEmbed('This giveaway is not active.')],
                ephemeral: true,
            });
        }

        if (!giveaway.entries.includes(interaction.member.id)) {
            giveaway = await Giveaways.findOneAndUpdate(
                { giveaway: interaction.message.id },
                { $push: { entries: interaction.member.id } },
                { new: true }
            );

            const embed = new Discord.EmbedBuilder(interaction.message.embeds[0].data);
            embed.setDescription(
                [
                    giveaway.description ? giveaway.description : null,
                    giveaway.description ? '' : null,
                    `Winners: **${giveaway.winners}**, Entries: **${giveaway.entries.length}**`,
                    `Status: Ongoing, ends in <t:${Moment(giveaway.expires).unix()}:R>(<t:${Moment(
                        giveaway.expires
                    ).unix()}:f>)`,
                ]
                    .filter((text) => text !== null)
                    .join('\n')
            );

            await interaction.update({ embeds: [embed] });
            await interaction.followUp({
                embeds: [EmbedGenerator.basicEmbed('You have entered the giveaway.')],
                ephemeral: true,
            });
        } else {
            return interaction.reply({
                embeds: [EmbedGenerator.errorEmbed('You have already entered the giveaway!')],
                ephemeral: true,
            });
        }
    },
};
