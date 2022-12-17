const { CommandInteraction, ApplicationCommandType, PermissionFlagsBits, ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    name: `Channel Mute`,
    UserPerms: ['ModerateMembers'],
    context: true,
    type: ApplicationCommandType.Message,
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel } = interaction;

        const fetchMsg = await channel.messages.fetch(interaction.targetId);
        const target = fetchMsg.author;
        const permissionInChannel = channel.permissionsFor(target.id)?.has(PermissionFlagsBits.SendMessages);

        // If the target is already muted in this channel
        if (permissionInChannel === undefined) {
            return interaction.reply({
                content: `An error occured. This user may no longer be a server memeber`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        // If the target is already muted in this channel
        if (permissionInChannel === false) {
            return interaction.reply({
                content: `${target} is already muted in ${channel}`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        const modal = new ModalBuilder()
            .setTitle('Channel Mute')
            .setCustomId('channel-mute-modal')

        const input1 = new TextInputBuilder()
            .setCustomId('input1')
            .setLabel('Username')
            .setStyle(1)
            .setValue(`${target?.tag}`)
            .setMinLength(1)
            .setMaxLength(54)
            .setRequired(true)

        const input2 = new TextInputBuilder()
            .setCustomId('input2')
            .setLabel('Duration (hours)')
            .setStyle(1)
            .setPlaceholder('Leave blank to mute indefinitely')
            .setMinLength(0)
            .setMaxLength(2)
            .setRequired(false)

        const input3 = new TextInputBuilder()
            .setCustomId('input3')
            .setLabel('Reason for muting')
            .setStyle(2)
            .setMinLength(1)
            .setMaxLength(512)
            .setRequired(true)

        const row1 = new ActionRowBuilder().addComponents([input1]);
        const row2 = new ActionRowBuilder().addComponents([input2]);
        const row3 = new ActionRowBuilder().addComponents([input3]);

        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
    }
}