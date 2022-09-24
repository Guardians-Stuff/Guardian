const { Client, GuildChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
	name: "channelDelete",

	async execute(channel, client) {

		const { guild, name } = channel 

		const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
		const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

		if (!Data) return 
		if (Data.ChannelStatus === false) return
		if (!data) return 

		const logsChannel = data.Channel 

		const Channel = await guild.channels.cache.get(logsChannel)
		if (!Channel) return 

		return Channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(client.channelD)
					.setTitle(`${process.env.settings} | Channel Deleted`)
					.setDescription(`A channel has been deleted named: ${name}`)
					.setThumbnail(guild.iconURL())
					.setFooter({ text: "Logging system."})
					.setTimestamp()
			]
		})
	}
}