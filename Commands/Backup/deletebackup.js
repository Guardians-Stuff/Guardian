const Discord = require(`discord.js`);
const backupSchema = require(`../../Schemas/Backup`);

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('deletebackup')
        .setDescription('Delete a backup of the server.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('backup_id')
                .setDescription('The ID of the backup you want to delete')
                .setRequired(true)
        ),
    /**
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     */
    async execute(interaction, client, dbGuild) {
        const backupId = interaction.options.getString('backup_id');
        const backup = await backupSchema.findOne({
            id: backupId,
            guildId: interaction.guild.id,
        });
        if (!backup) {
            return interaction.reply({
                content: 'No backup found with that ID',
                ephemeral: true,
            });
        }
        await backupSchema.deleteOne({
            id: backupId,
            guildId: interaction.guild.id,
        });
        interaction.reply({
            content: `Backup with ID ${backupId} has been deleted.`,
            ephemeral: true,
        });
    },
};
