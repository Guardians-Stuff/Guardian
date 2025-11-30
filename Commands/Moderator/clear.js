const Discord = require('discord.js');
const Transcripts = require('discord-html-transcripts');

const { GuildsManager } = require('../../Classes/GuildsManager');
const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('clear')
        .setDMPermission(false)
        .setDescription('Bulk delete messages')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addNumberOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount of messages to delete.')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('Reason for deleting.').setRequired(true)
        )
        .addUserOption((option) =>
            option.setName('target').setDescription('Only delete messages from this user.')
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const amount = interaction.options.getNumber('amount', true);
        const reason = interaction.options.getString('reason', true);
        const target = interaction.options.getUser('target');

        /** @type {Discord.Collection<string, Discord.Message>} */ const messages =
            await interaction.channel.messages.fetch({ limit: amount });
        if (target) messages = messages.filter((message) => message.author.id === target.id);
        if (messages.size === 0)
            return { embeds: [EmbedGenerator.errorEmbed('No messages found.')], ephemeral: true };

        /** @type {Discord.TextChannel} */ (interaction.channel)
            .bulkDelete(messages, true)
            .then(async (deleted) => {
                interaction.reply({
                    embeds: [
                        EmbedGenerator.basicEmbed(
                            `Cleared \`${messages.size}\` messages${
                                target ? ` from ${target}` : ''
                            }.`
                        ),
                    ],
                    ephemeral: true,
                });

                if (dbGuild.logs.enabled) {
                    const channel = await interaction.guild.channels.fetch(dbGuild.logs.moderator);
                    if (channel && channel instanceof Discord.TextChannel) {
                        const transcript = await Transcripts.generateFromMessages(
                            messages,
                            interaction.channel
                        );

                        channel.send({
                            embeds: [
                                EmbedGenerator.basicEmbed(
                                    [
                                        `- Moderator: ${interaction.member}`,
                                        `- Target: ${target || 'None'}`,
                                        `- Channel: ${interaction.channel}`,
                                        `- Reason: ${reason}`,
                                    ].join('\n')
                                ).setTitle('`/clear` command used'),
                            ],
                            files: [transcript],
                        });
                    }
                }
            })
            .catch(() => {
                interaction.reply({ embeds: [EmbedGenerator.errorEmbed()], ephemeral: true });
            });
    },
};
