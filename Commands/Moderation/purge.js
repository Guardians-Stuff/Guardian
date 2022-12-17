const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const path = require('path');

module.exports = {
    name: `purge`,
    description: `Purges a specific number of messages from a channel or user`,
    UserPerms: ['ModerateMembers'],
    options: [{
        name: `amount`,
        description: `Number of messages to delete`,
        type: ApplicationCommandOptionType.Number,
        required: true
    },
    {
        name: `username`,
        description: `Include a username to delete their messages only`,
        type: ApplicationCommandOptionType.User,
        required: true
    }],
    /**
     * @param {CommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild, member, channel, options } = interaction;

        await interaction.deferReply({ ephemeral: true }).catch(err => console.error(`${path.basename(__filename)} There was a problem deferring an interaction: `, err));

        const amount = options.getNumber('amount');
        const target = options.getMember('username');
        const fetchMsg = await channel.messages.fetch();

        if (!guild.members.me.permissionsIn(channel).has('ManageMessages') || !guild.members.me.permissionsIn(channel).has('SendMessages') || !guild.members.me.permissionsIn(channel).has('ViewChannel')) {
            return interaction.editReply({
                content: `Missing permissions for ${channel}`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        if (fetchMsg.size < 1) {
            return interaction.editReply({
                content: `I could not find any messages from ${target} in ${channel}`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        if (amount < 1 && member.id === process.env.OWNER_ID || amount > 100 && member.id === process.env.OWNER_ID) {
            return interaction.editReply({
                content: `Amount must be between 1 and 100`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        if (amount < 1 || amount > 5 && member.id !== process.env.OWNER_ID) {
            return interaction.editReply({
                content: `Amount must be between 1 and 5`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        if (!target && member.id !== process.env.OWNER_ID) {
            return interaction.editReply({
                content: `You must include a username`,
                ephemeral: true
            }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
        }

        if (target) {
            let i = 0;
            const filtered = [];

            fetchMsg.filter(msg => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            channel.bulkDelete(filtered, true).catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)).then(deleted => {
                interaction.editReply({
                    content: `${deleted.size} messages from ${target} deleted in ${channel}`,
                    ephemeral: true
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
            });
        } else {
            let i = 0;
            const filtered = [];

            fetchMsg.filter(msg => {
                if (!msg.system && amount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
            channel.bulkDelete(amount, true).catch(err => console.error(`${path.basename(__filename)} There was a problem deleting a message: `, err)).then(deleted => {
                interaction.editReply({
                    content: `${deleted.size} messages deleted in ${channel}`,
                    ephemeral: true
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
            });
        }
    }
}