const Discord = require("discord.js");
const Mongoose = require("mongoose");

const Guilds = require("../../Schemas/Guilds");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Receive information about the bot")
    .setDMPermission(false),
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor(uptime / 3600) % 24;
    const minutes = Math.floor(uptime / 60) % 60;
    const seconds = Math.floor(uptime % 60);

    const replyEmbed = new Discord.EmbedBuilder()
      .addFields(
        {
          name: `Name`,
          value: `Guardian`,
          inline: true,
        },
        {
          name: `ID`,
          value: `1053736067129421884`,
          inline: true,
        },
        {
          name: `Developers`,
          value: `Maxxie`,
          inline: true,
        },
        {
          name: "Total Guilds",
          value: `\`${interaction.client.guilds.cache.size}\``,
          inline: true,
        },
        {
          name: "Total Users",
          value: `\`${
            (
              await Guilds.aggregate([
                { $unwind: { path: "$members" } },
                { $group: { _id: null, totalMembers: { $sum: 1 } } },
              ])
            )[0].totalMembers
          }\``,
          inline: true,
        },
        {
          name: "Uptime",
          value: `\`${days}d:${hours}h:${minutes}m:${seconds}s\``,
          inline: true,
        },
        {
          name: `Dependency versions`,
          value: `NodeJS: \`${process.version}\`\nDiscord.JS: \`${Discord.version}\`\nMongoose: \`${Mongoose.version}\``,
          inline: true,
        },
        {
          name: `Links`,
          value:
            "[**Github**](https://github.com/Guardians-Stuff/Guardian)\n[**Invite**](https://discord.com/oauth2/authorize?client_id=1093047924172279900&scope=bot)",
          inline: true,
        }
      )
      .setColor("Blue")
      .setTimestamp();

    return replyEmbed;
  },
};
