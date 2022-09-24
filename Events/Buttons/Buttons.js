const { Client, MessageComponentInteraction, EmbedBuilder, InteractionType } = require("discord.js")
const DB = require("../../Structures/Schemas/Verification")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "interactionCreate",

    /**
     * 
     * @param {MessageComponentInteraction} interaction 
     * @param {Client} client 
     */


    async execute(interaction, client) {
        const { guild, customId, member, type} = interaction

        if(type !== InteractionType.MessageComponent) return
        const CustomID = ["verify"]
        if(!CustomID.includes(customId)) return

        await interaction.deferReply({ ephmeral: true })

        const Data = await DB.findOne({ Guild: guild.id}).catch(err => { })
        if(!Data) return EditReply(interaction, ":x:", "Couldnt find any data!")

        const Role = guild.roles.cache.get(Data.Role)
        if(member.roles.cache.has(Role.id)) return EditReply(interaction,"x", "You are already verified in this guild!")

        await member.roles.add(Role)

        EditReply(interaction, "✅", "You are now verified as a member.")
    }
}