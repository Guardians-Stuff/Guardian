const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const { ApplicationCommand } = InteractionType
const BlacklistGuildDB = require("../../Structures/Schemas/BlacklistG")
const BlacklistUserDB = require("../../Structures/Schemas/BlacklistU")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param { CommandInteraction } interaction
     * @param { Client } client
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type} = interaction

        if(!guild || user.bot) return
        if(type !== ApplicationCommand) return
        
        const BlackListGuildData = await BlacklistGuildDB.findOne({ Guild: guild.id }).catch( err => { })
        const BlackListUserData = await BlacklistUserDB.findOne({ User: user.id }).catch( err => { })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setTimestamp()
            .setFooter(({ text: "Blacklisted guild from the bot"}))


        const command = client.commands.get(commandName)

        if(!command) return Reply(interaction, "X", "An error occured while running the command!", true) ** client.
        commands.delete(commandName)

        if(BlackListGuildData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("Server Blacklisted")
                    .setDescription(`Your server has been blacklisted from using this bot <t:${parseInt(BlackListGuildData.Time / 1000)}:R>, for the reason: **${BlackListGuildData.Reason}**`)
            ]
        })

        if(BlackListUserData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("User Blacklisted")
                    .setDescription(`You have been blacklisted from using this bot <t:${parseInt(BlackListUserData.Time / 1000)}:R>, for the reason: **${BlackListUserData.Reason}**`)
            ]
        })

        if(command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply 
        (interaction, "X", `You need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command!`, true)

        if(command.BotPerms && command.BotPerms.length !== 0) if (!member.permissions.has(command.BotPerms)) return Reply 
        (interaction, "X", `I need \`${command.BotPerms.join(", ")}\` permission(s) to execute this command!`, true)
        
        command.execute(interaction, client)
    
    }

}