const Discord = require('discord.js');

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction) {
        if(!interaction.isButton()) return;

        const splitArray = interaction.customId.split("-")
        if(splitArray[0] !== 'MemberLogging') return;

        const member = await interaction.guild.members.fetch(splitArray[2]).catch(() => null);
        if(!member) return;

        const errorArray = []
        if (!interaction.member.permissions.has('KickMembers')) errorArray.push("You do not have the required permissions for this action.")
        if (!member) errorArray.push("This user is no longer in this server.")
        if (!member.moderatable) errorArray.push("This user cannot be moderated by the bot.")

        if(errorArray.length) return interaction.reply({
            embeds: [ EmbedGenerator.errorEmbed(errorArray.join('\n')) ],
            ephemeral: true
        });

        switch (splitArray[1]) {
            case 'Kick': {
                member.kick(`Kicked by: ${interaction.user.tag} | Member Logging System`).then(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.basicEmbed(`${member} has been kicked.`)] });
                }).catch(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.errorEmbed(`${member} couldn't be kicked.`)] });
                });

                break;
            }

            case 'Ban': {
                member.ban(`Banned by: ${interaction.user.tag} | Member Logging System`).then(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.basicEmbed(`${member} has been banned.`)] })
                }).catch(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.errorEmbed(`${member} couldn't be banned.`)] })
                });

                break;
            }
        }
    }
}