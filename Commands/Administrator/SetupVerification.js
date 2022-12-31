const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('setup_verification')
        .setDescription('Configure the member verification system.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('type')
            .setDescription('How to verify members.')
            .addChoices(
                { name: 'Don\'t verify members', value: 'disable' },
                { name: 'Press a button', value: 'button' },
                { name: 'Use a command', value: 'command' },
                { name: 'Use a command with a captcha', value: 'captcha' }
            ).setRequired(true)
        ).addRoleOption(option => option
            .setName('role')
            .setDescription('Role to give to unverified members. (Will be created if unspecified)')
        ).addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel used for unverified members. (Will be created if unspecified)')
            .addChannelTypes(Discord.ChannelType.GuildText)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const type = interaction.options.getString('type', true);
        /** @type {Discord.Role} */ let role = interaction.options.getRole('role');
        /** @type {Discord.TextChannel} */ let channel = interaction.options.getChannel('channel');

        if(type == 'disable'){
            dbGuild.verification.enabled = false;
            dbGuild.verification.version = null;
            dbGuild.verification.channel = null;
            dbGuild.verification.role = null;

            return EmbedGenerator.basicEmbed('🔓 | Member verification has been disabled.')
        }

        await interaction.deferReply();

        if(!role){
            role = await interaction.guild.roles.create({
                name: 'unverified',
                color: '#000001',
                hoist: false,
                mentionable: false,
                permissions: [],
                position: 0
            }).catch(() => null);

            if(!role) return EmbedGenerator.errorEmbed(':x: | Failed to create a verification role');
        }

        if(!channel){
            channel = await interaction.guild.channels.create({
                name: 'verification',
                type: Discord.ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: [ 'ViewChannel', 'ReadMessageHistory' ]
                    },
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [ 'ViewChannel', 'SendMessages' ]
                    }
                ] }).catch(() => null);

            if(!channel) return EmbedGenerator.errorEmbed(':x: | Failed to create a verification channel');

            for(const c of (await interaction.guild.channels.fetch()).values()) if(channel.id != c.id) await c.permissionOverwrites.create(role.id, { ViewChannel: false }).catch(() => null);
        }

        if(type == 'button'){
            await channel.send({
                embeds: [
                    EmbedGenerator.basicEmbed([
                        'This server uses Guardian\'s Verification System.',
                        'To complete verification please press the verify button.'
                    ].join('\n')).setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                ],
                components: [
                    new Discord.ActionRowBuilder().addComponents([
                        new Discord.ButtonBuilder()
                            .setCustomId('verification')
                            .setLabel('Verify')
                            .setStyle(Discord.ButtonStyle.Success)
                    ])
                ]
            });
        }else if(type == 'command'){
            await channel.send({
                embeds: [
                    EmbedGenerator.basicEmbed([ 
                        'This server uses Guardian\'s Verification System.',
                        'To complete verification please use the `/verify` command.'
                    ].join('\n')).setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                ]
            });
        }else if(type == 'captcha'){
            await channel.send({
                embeds: [
                    EmbedGenerator.basicEmbed([
                        'This server uses Guardian\'s Verification System.',
                        'To start verification please use the `/verify` command.',
                        'To complete verification please use the `/verify [captcha]` command with the captcha.'
                    ].join('\n')).setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                ]
            });
        }

        dbGuild.verification.enabled = true;
        dbGuild.verification.version = type;
        dbGuild.verification.channel = channel.id;
        dbGuild.verification.role = role.id;

        return EmbedGenerator.basicEmbed('🔒 | Member verification has been enabled.');
    }
}