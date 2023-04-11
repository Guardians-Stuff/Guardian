const Discord = require(`discord.js`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('addrole')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDescription('Add a role to a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to add the role to.').setRequired(true)
        )
        .addRoleOption((option) =>
            option.setName('role').setDescription('The role to add to the user.').setRequired(true)
        )
        .setDefaultPermission(false),
    async execute(interaction, client, dbGuild) {
        const user = interaction.options.getMember('user'); // change from getUser to getMember
        const role = interaction.options.getRole('role');
        try {
            await user.roles.add(role); // remove null check for user.roles
            interaction.reply({
                content: `Successfully added ${role.name} to ${user.user.username}.`, // add .user to user to get the user object
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: 'There was an error adding the role.',
                ephemeral: true,
            });
        }
    },
};
