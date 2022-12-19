const { Client, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } = require("discord.js")
const Reply = require("../../Systems/Reply")
const levelDB = require("../../Structures/Schemas/Level")
const Canvacord = require("canvacord")

module.exports = {
    name: "rank",
    description: "Displays rank card.",
    category: "Levels",
    premium: true,
    options: [
        {
            name: "user",
            description: "Select a user",
            required: false,
            type: 6
        }
    ],

    async execute(interaction, client) {

        const { options, user, guild } = interaction 

        const Member = options.getMember("user") || user 
        const member = guild.members.cache.get(Member.id)

        const Data = await levelDB.findOne({ Guild: guild.id, User: member.id }).catch(err => { })
        if (!Data) return Reply(interaction, "❌", `${member} has not gained any XP!`)

        await interaction.deferReply()

        const Required = Data.Level * Data.Level * 100 + 100

        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setBackground("IMAGE", "https://media.discordapp.net/attachments/1053734583536984084/1054236920705728602/Z.png")
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level, "Level")
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
        
        const Card = await rank.build().catch(err => console.log(err))

        const attachment = new AttachmentBuilder(Card, { name: "rank.png" })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`${member.user.username}'s Rank Card`)
            .setImage("attachment://rank.png")
        
        interaction.editReply({ embed: [Embed], files: [attachment] })

    }
}