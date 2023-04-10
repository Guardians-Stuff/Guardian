const Discord = require(`discord.js`);
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("totalbans")
    .setDescription("Check how many users are banned in the server.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const bannedUsers = await interaction.guild.bans.fetch();
    interaction.reply(
      `There are currently ${bannedUsers.size} banned users in this server.`
    );
  },
};
