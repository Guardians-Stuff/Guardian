const { PermissionFlagsBits, EmbedBuilder, SlashCommandBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member of the discord.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option => option.setName(`user`).setDescription(`The user you'd like to kick.`))
        .addStringOption(option => option.setName(`reason`).setDescription(`Reason for kicking the user.`)),
    execute(interaction, client) {

        const kickUser = interaction.options.getUser('user');
        const kickMember = interaction.guild.members.fetch(kickUser.id);
        const channel = interaction.channel;

        if (!kickMember) return interaction.reply({ content: 'That user is no longer in the server.', ephemeral: true });
        if (!kickMember.kickable) return interaction.reply({ content: 'User cannot be kicked.', ephemeral: true });

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "Unspecified reason.";

        const dmEmbed = new EmbedBuilder()
            .setColor('#fff176')
            .setDescription(`You have been kicked from ${interaction.guild.name} | ${reason}`);

        const embed = new EmbedBuilder()
            .setColor('#fff176')
            .setDescription(`${kickUser.tag} has been kicked. | ${reason}`);

        kickMember.send({
            embeds: [dmEmbed]
        }).catch(err => {
            return;
        });

        kickMember.kick({
            reason: reason
        }).catch(err => {
            interaction.reply({
                content: "There was an error.", ephemeral: true
            });
        });

        interaction.reply({ embeds: [embed] });
    }
}