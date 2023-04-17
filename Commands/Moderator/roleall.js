const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('giveroleall')
        .setDescription('Gives a specified role to all members in the server.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
        .addRoleOption((option) =>
            option
                .setName('role')
                .setDescription('The role to give to all members.')
                .setRequired(true)
        ),
    async execute(interaction, client, dbGuild) {
        const role = interaction.options.getRole('role');
        const members = interaction.guild.members.cache;
        members.forEach((member) => {
            member.roles.add(role);
        });
        await interaction.reply(`Successfully gave the ${role.name} role to all members.`);
    },
};
