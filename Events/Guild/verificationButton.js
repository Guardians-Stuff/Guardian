const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');
const { GuildsManager } = require('../../Classes/GuildsManager');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'verification') return;

        const guild = await GuildsManager.fetch(interaction.guild.id);
        if (!guild.verification.enabled)
            interaction.reply({
                embeds: [
                    EmbedGenerator.errorEmbed(
                        "This guild doesn't have the Verification system enabled."
                    ),
                ],
                ephemeral: true,
            });
        if (guild.verification.version !== 'button')
            interaction.reply({
                embeds: [EmbedGenerator.errorEmbed('This guild uses a command for verification.')],
                ephemeral: true,
            });

        await interaction.member.roles
            .remove(guild.verification.role, 'Verification completed')
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()], ephemeral: true });
            });

        interaction.reply({
            embeds: [EmbedGenerator.basicEmbed('Verification completed.')],
            ephemeral: true,
        });
    },
};
