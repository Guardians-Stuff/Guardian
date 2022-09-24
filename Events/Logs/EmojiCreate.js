const { Client, GuildChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
	name: "emojiCreate",

	async execute(emoji, client) {

		const { guild, id } = emoji 

		const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
		const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => { })

		if (!Data) return 
		if (Data.EmojiStatus === false) return
		if (!data) return 

		const logsChannel = data.Channel 

		const Channel = await guild.channels.cache.get(logsChannel)
		if (!Channel) return 

		return Channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(client.emojiC)
					.setTitle(`${process.env.settings} | Emoji Created`)
					.setDescription(`An emoji has been added to the server: ${emoji}, **${id}**.`)
					.setThumbnail(guild.iconURL())
					.setFooter({ text: "Logging system."})
					.setTimestamp()
			]
		})
	}
}