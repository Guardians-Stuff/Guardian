const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('setup')
        .setDescription('Configure the anti-raid protection system.')
        .addNumberOption((option) =>
            option
                .setName('join_within')
                .setDescription('Amount of seconds to track new members for')
                .setMinValue(1)
                .setMaxValue(ms('1h') / 1000)
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('join_amount')
                .setDescription('Amount of new members to trigger protection')
                .setMinValue(2)
                .setMaxValue(200)
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('lockdown')
                .setDescription('Whether or not to lockdown the server on trigger')
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('Channel for raid announcements')
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('action')
                .setDescription('Action to take against raid members')
                .addChoices({ name: 'Kick', value: 'kick' }, { name: 'Ban', value: 'ban' })
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const joinWithin = interaction.options.getNumber('join_within', true);
        const joinAmount = interaction.options.getNumber('join_amount', true);
        const lockdown = interaction.options.getBoolean('lockdown', true);
        /** @type {Discord.TextChannel} */ const channel = interaction.options.getChannel(
            'channel',
            true
        );
        /** @type { null | 'kick' | 'ban' } */ const action =
            interaction.options.getString('action');

        dbGuild.antiraid.enabled = true;
        dbGuild.antiraid.joinWithin = joinWithin;
        dbGuild.antiraid.joinAmount = joinAmount;
        dbGuild.antiraid.lockdown.enabled = lockdown;
        dbGuild.antiraid.channel = channel.id;
        dbGuild.antiraid.action = action;

        return EmbedGenerator.basicEmbed('🔒 | Anti-raid protection has been enabled!');
    },
};
