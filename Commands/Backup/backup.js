const Discord = require(`discord.js`);
const backupSchema = require(`../../Schemas/Backup`);

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("backup")
    .setDescription("Create a backup of the server.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.Client} client
   * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
   */
  async execute(interaction, client, dbGuild) {
    const guildId = interaction.guild.id;
    const existingBackup = await backupSchema.findOne({ guildId });
    if (existingBackup) {
      interaction.reply(`A backup for this server already exists.`);
      return;
    }
    const backup = {
      guildId,
      date: new Date().toLocaleString(),
      name: `backup-${guildId}-${new Date().getTime()}`,
      backupId: newBackup._id, // Added backupId to the backup object
      roles: interaction.guild.roles.cache.map((role) => role),
      channels: interaction.guild.channels.cache.map((channel) => channel),
      permissions: interaction.guild.roles.cache.map(
        (role) => role.permissions
      ),
    };
    const newBackup = await new backupSchema(backup).save();
    interaction.user.send(
      `Backup created with name ${backup.name} and ID ${newBackup._id}`
    );
    //interaction.reply(`Backup created with name ${backup.name}`);
  },
};
