const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

const Guilds = require('../../Schemas/Guilds');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction 
     */
    async execute(interaction) {
        if(!interaction.isButton() || interaction.customId != 'verification') return;

        const guild = await Guilds.findOne({ guild: interaction.guild.id });
        await interaction.member.roles.remove(guild.verification.role, 'Verification completed').catch(() => {
            interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
        });

        interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Verification completed') ], ephemeral: true });
    }
}