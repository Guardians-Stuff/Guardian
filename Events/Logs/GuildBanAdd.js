const { Client, GuildChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
	name: "guildBanAdd",

	async execute(guild, user, client) {

		const { id, username, discriminator } = emoji 

		const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
		const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

		if (!Data) return 
		if (Data.MemberBan === false) return
		if (!data) return 

		const logsChannel = data.Channel 

		const Channel = await guild.channels.cache.get(logsChannel)
		if (!Channel) return 

		return Channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(client.serverB)
					.setTitle(`${process.env.settings} | User Banned`)
					.setDescription(`**${username}#${discriminator}** (${id}) has been banned from the server.`)
					.setThumbnail(guild.iconURL())
					.setFooter({ text: "Logging system."})
					.setTimestamp()
			]
		})
	}
}