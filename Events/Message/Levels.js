const { Client, Message, EmbedBuilder } = require("discord.js")
const levelDB = require("../../Structures/Schemas/Level")
const ChannelDB = require("../../Structures/Schemas/LevelUpChannel")

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        const { author, guild } = message

        if (!guild || author.bot) return

        levelDB.findOne({ Guild: guild.id, User: author.id }, async (err, data) => {
            
            if (err) throw err 

            if (!data) {

                levelDB.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0, 
                    Level: 0
                })

            }

        })

        const ChannelData = await ChannelDB.findOne({ Guild: guild.id }).catch(err => { })

        const give = Math.floor(Math.random() * 29) + 1

        const data = await levelDB.findOne({ Guild: guild.id, User: author.id }).catch(err => { })
        if (!data) return 

        const requiredXP = data.Level * data.Level * 100 + 100 

        if (data.XP + give >= requiredXP) {

            data.XP += give
            data.Level += 1
            await data.save()

            if (ChannelData) {

                const Channel = guild.channels.cache.get(ChnnelData.Channel)
                if (!Channel) return

                Channel.send({
                    content: `${author}`,
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`Congrats! You have reached ${data.Level} level!`)
                    ]
                })

            }

        } else {

            data.XP += give
            await data.save()

        }

    }
}