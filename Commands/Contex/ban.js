const { CommandInteraction, ApplicationCommandType, ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    name: `Ban`,
    UserPerms: ['ModerateMembers'],
    category: 'Context',
    context: true,
    type: ApplicationCommandType.User,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId).catch(() => { });
        if (!target) {
            return interaction.reply({
                content: `This user no longer exists`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem editing an interaction: `, err));
        }

        const modal = new ModalBuilder()
            .setTitle(`Ban ${target.user.tag}`)
            .setCustomId('ban-modal')

        const input1 = new TextInputBuilder()
            .setCustomId('input1')
            .setLabel('User id')
            .setStyle(1)
            .setValue(`${target.user.id}`)
            .setMinLength(1)
            .setMaxLength(54)
            .setRequired(true)

        const input2 = new TextInputBuilder()
            .setCustomId('input2')
            .setLabel('Reason')
            .setStyle(2)
            .setMinLength(1)
            .setMaxLength(512)
            .setRequired(true)

        const row1 = new ActionRowBuilder().addComponents([input1]);
        const row2 = new ActionRowBuilder().addComponents([input2]);

        modal.addComponents(row1, row2);

        await interaction.showModal(modal);
    }
}