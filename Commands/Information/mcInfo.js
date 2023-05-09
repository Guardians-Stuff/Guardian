const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc-info')
    .setDescription('Shows some information on specified Minecraft server.')
    .addStringOption(option =>
      option.setName('server')
        .setDescription('Specified IP address or hostname of the Minecraft server will be used for the results.')
        .setMaxLength(200)
        .setRequired(true)),
  async execute(interaction) {
    const serverAddress = interaction.options.getString('server');

    try {
      const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
      const data = await response.json();

      if (data.online === true) {
        const serverStatus = 'Online';
        const playerCount = data.players ? data.players.online : 0;

        const embed = new EmbedBuilder()
          .setColor('Green')
          .setAuthor({ name: `⛏ Minecraft Toolbox`})
          .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081199958704791552/largegreen.png')
          .setFooter({ text: `⛏ Server Online`})
          .setTitle(`> Minecraft Server \n> Information: ${serverAddress}`)
          .addFields(
            { name: '• Status', value: `> ${serverStatus}` })
            .addFields({ name: '• Players Online', value: `> ${playerCount}` }
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      } else {
        const serverStatus = 'Offline';

        const embed = new 
        EmbedBuilder()
          .setColor('DarkRed')
          .setAuthor({ name: `⛏ Minecraft Toolbox`})
          .setFooter({ text: `⛏ Server Offline`})
          .setThumbnail('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024')
          .setTitle(`> Minecraft Server \n> Information: ${serverAddress}`)
          .addFields(
            { name: '• Status', value: `> ${serverStatus}` },
          )
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      interaction.reply({content: `An error occurred while retrieving information for server: **${serverAddress}**.`, ephemeral: true });
    }
  },
};