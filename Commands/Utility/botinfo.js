const { EmbedBuilder, version, CommandInteraction, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors  } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');

module.exports = {
    name: "botinfo",
    description: "Displays bot information.",
    execute: async (interaction, client) => {

        await interaction.deferReply({
            ephemeral: false
        });

        const uptime = moment.duration(interaction.client.uptime).format(" d [days], h [hrs], m [mins], s [secs]");
        const cpu = await si.cpu();
        
        let ccount = client.channels.cache.size;
        let scount = client.guilds.cache.size;
        let mcount = 0;
        client.guilds.cache.forEach((guild) => { mcount += guild.memberCount })

        const row = new ActionRowBuilder();
        let but4 = new ButtonBuilder().setURL("https://discord.com/api/oauth2/authorize?client_id=1016123357957197904&permissions=8&scope=applications.commands%20bot").setLabel("Invite").setStyle(ButtonStyle.Link).setEmoji("1014738330627346512")

        let but5 = new ButtonBuilder().setURL("https://discord.gg/d4FxAhcVBU").setLabel("Support").setStyle(ButtonStyle.Link).setEmoji("1014737704841388054")

        const statsEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Bot Information")
        .setDescription(`[**Invite**](https://discord.com/) ● [**Support Server**](https://discord.gg/)`)
        .addFields (
            { name: `**Servers**`, value: `\`\`\`Total: ${client.guilds.cache.size} servers\`\`\``, inline: true },
            { name: `*Users**`, value: `\`\`\`Total: ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users\`\`\``, inline: true },
            { name: `**Node Version**`, value: `\`\`\`v${process.versions.node}\`\`\``, inline: true },
            { name: `**Discord.js**`, value: `\`\`\`v14.1.0\`\`\``, inline: true },
            { name: `**Uptime**`, value: `\`\`\`${uptime}\`\`\``, inline: true },
            { name: `**Ping**`, value: `\`\`\`${client.ws.ping}ms\`\`\``, inline: true },

            { name: `**Developers**`, value: `\`\`\`\nYour Name\n\`\`\``, inline: true }
        )
        .setFooter({text: `Requested by ${interaction.member.user.username}`, iconURL: "https://images-ext-2.discordapp.net/external/Qgg69AokguD8x6K4iD4NiC-WGMe981S_HSBufj0DDyY/https/cdn.discordapp.com/avatars/801007955109216257/aaeb4e572179e01520551f3bc347ca38.webp"})

        
        interaction.followUp({ embeds: [statsEmbed], components: [new ActionRowBuilder().addComponents(but4, but5)] });
    }
}

// required pakages: moment, os, systeminformation

