const Discord = require(`discord.js`);

const EmbedGenerator = require('../../Functions/embedGenerator');

const ReactionRoles = require('../../Schemas/ReactionRoles');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Create a reaction role message.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('title').setDescription('Title to use for the embed.').setRequired(true)
        )
        .addRoleOption((option) =>
            option.setName('role1').setDescription('Reaction Role.').setRequired(true)
        )
        .addRoleOption((option) => option.setName('role2').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role3').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role4').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role5').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role6').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role7').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role8').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role9').setDescription('Reaction Role.'))
        .addRoleOption((option) => option.setName('role10').setDescription('Reaction Role.')),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const title = interaction.options.getString('title', true);
        const roles = [
            interaction.options.getRole('role1', true),
            interaction.options.getRole('role2'),
            interaction.options.getRole('role3'),
            interaction.options.getRole('role4'),
            interaction.options.getRole('role5'),
            interaction.options.getRole('role6'),
            interaction.options.getRole('role7'),
            interaction.options.getRole('role8'),
            interaction.options.getRole('role9'),
        ].filter((role) => !!role);

        await interaction.deferReply({ ephemeral: true });

        /** @type {Discord.TextChannel} */ (interaction.channel)
            .send({
                embeds: [
                    EmbedGenerator.basicEmbed(
                        roles.map((role, index) => `**${index + 1}** | ${role}`).join('\n')
                    ).setTitle(`${title} | Reaction Roles`),
                ],
            })
            .catch(() => {
                interaction.editReply({ embeds: [EmbedGenerator.errorEmbed()] });
            })
            .then(async (/** @type {Discord.Message} */ sent) => {
                for (let i = 0; i < roles.length; i++)
                    await sent.react(['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'][i]); // should probably .catch() this but idk how
                await ReactionRoles.create({
                    guild: interaction.guild.id,
                    message: sent.id,
                    roles: roles.map((role) => role.id),
                });

                interaction.editReply({
                    embeds: [EmbedGenerator.basicEmbed('Reaction Role message created.')],
                });
            });
    },
};
