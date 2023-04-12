const Discord = require('discord.js');
const ms = require('ms');

const EmbedGenerator = require('../../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandSubcommandBuilder()
        .setName('setup')
        .setDescription('Configure the ticket system.')
        .addChannelOption((option) =>
            option
                .setName('category')
                .setDescription("Category to put ticket's in.")
                .addChannelTypes(Discord.ChannelType.GuildCategory)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('Channel used for opening tickets.')
                .addChannelTypes(Discord.ChannelType.GuildText)
        )
        .addChannelOption((option) =>
            option
                .setName('staff_channel')
                .setDescription('Channel used for staff discussion')
                .addChannelTypes(Discord.ChannelType.GuildText)
        )
        .addRoleOption((option) =>
            option.setName('role').setDescription("Staff role which can access ticket's")
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        /** @type {Discord.CategoryChannel} */ let category =
            interaction.options.getChannel('category');
        /** @type {Discord.TextChannel} */ let channel = interaction.options.getChannel('channel');
        /** @type {Discord.TextChannel} */ let staffChannel =
            interaction.options.getChannel('staff_channel');
        /** @type {Discord.Role} */ let role = interaction.options.getRole('role');

        if (!role) {
            role = await interaction.guild.roles
                .create({
                    name: 'Ticket Staff',
                    hoist: false,
                    color: '#000001',
                    mentionable: false,
                })
                .catch(() => {
                    return interaction.reply({
                        embeds: [EmbedGenerator.errorEmbed('Failed to create role.')],
                    });
                });
        }

        if (!category) {
            category = await interaction.guild.channels
                .create({
                    name: 'Tickets',
                    type: Discord.ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ['ViewChannel', 'SendMessages'],
                        },
                        {
                            id: role.id,
                            allow: ['ViewChannel', 'SendMessages'],
                        },
                    ],
                })
                .catch(() => {
                    return interaction.reply({
                        embeds: [EmbedGenerator.errorEmbed('Failed to create category.')],
                    });
                });
        }

        if (!staffChannel) {
            staffChannel = await interaction.guild.channels
                .create({
                    name: 'staff-chat',
                    type: Discord.ChannelType.TextChannel,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ['ViewChannel', 'SendMessages'],
                        },
                    ],
                })
                .catch(() => {
                    return interaction.reply({
                        embeds: [EmbedGenerator.errorEmbed('Failed to create channel.')],
                    });
                });
        } else {
            await staffChannel.setParent(category.id).catch(() => null);
            await staffChannel.permissionOverwrites
                .edit(role.id, { ViewChannel: true, SendMessages: true })
                .catch(() => null);
        }

        if (!channel) {
            channel = await interaction.guild.channels
                .create({
                    name: 'create-ticket',
                    type: Discord.ChannelType.TextChannel,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone.id,
                            allow: ['ViewChannel'],
                        },
                    ],
                })
                .catch(() => {
                    return interaction.reply({
                        embeds: [EmbedGenerator.errorEmbed('Failed to create channel.')],
                    });
                });
        } else {
            await channel.setParent(category.id).catch(() => null);
            await channel.permissionOverwrites
                .edit(interaction.guild.roles.everyone.id, {
                    ViewChannel: true,
                    SendMessages: true,
                })
                .catch(() => null);
        }

        await channel
            .send({
                embeds: [
                    EmbedGenerator.basicEmbed(
                        'Please press the button to create a ticket.'
                    ).setAuthor({
                        name: `Create a Ticket | ${client.user.username}`,
                        iconURL: client.user.avatarURL(),
                    }),
                ],
                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId('open-ticket')
                            .setEmoji('✉️')
                            .setLabel('Open Ticket')
                            .setStyle(Discord.ButtonStyle.Success)
                    ),
                ],
            })
            .catch(() => null);

        dbGuild.tickets.enabled = true;
        dbGuild.tickets.category = category.id;
        dbGuild.tickets.channel = channel.id;
        dbGuild.tickets.role = role.id;

        return EmbedGenerator.basicEmbed('🔒 | Ticket system has been enabled!').setFooter({
            text: '(W.I.P) Please manually add access for Support Staff to use /ticket',
        });
    },
};
