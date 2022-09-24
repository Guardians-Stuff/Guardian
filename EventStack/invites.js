const { Client, EmbedBuilder } = require("discord.js")
const client = require("../Structures/index")
const invites = new Map()
const LogsDB = require("../Structures/Schemas/LogsChannel")
const wait = require("timers/promises").setTimeout
const { Discord } = require("discord-id")
const djsClient = new Discord(process.env.TOKEN)

client.on("ready", async() => {

    await wait(1000)

    client.guilds.cache.forEach(async guild => {

        const firstInvites = await guild.invites.fetch().catch(err => {

            if(err.code !== 50013) return console.log(err)

        })

        try {
            invites.set(guild.id, new Map(firstInvites.map(invite => [invite.code, invite.uses])))
        } catch (error) {
            if (error) return 
        }
    })
})

client.on("inviteDelete", invite => {

    invites.get(invite.guild.id).delete(invite.code)

})

client.on("inviteCreate", invite => {

    invites.get(invite.guild.id).set(invite.code, invite.uses)

})

client.on("guildCreate", guild => {

    guild.invites.fetch().then(guildInvites => {

        invites.set(guild.id, new Map(guildInvites.map(invite => [invite.code, invite.uses])))
    }).catch(err => {

        if (err.code !== 50013) return console.log(err)
    })
})

client.on("guildDelete", guild => {

    invites.delete(guild.id)

})

client.on("guildMemberAdd", async member => {

    const { guild, user } = member 

    guild.invites.fetch().then(async newInvites => {

        const oldInvites = invites.get(guild.id)
        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code))

        const Data = await LogsDB.findOne({ Guild: guild.id }).catch(err => { })

        const Channel = guild.channels.cache.get(Data.Channel)
        if (!Channel) return 

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Invite Logged")
            .setTimestamp()

        if (!invite) return Channel.send({
            embeds: [
                Embed.setDescription(`${user.tag} joined but, couldn't find through which invite!`)
            ]   
        })

        djsClient.grapProfile(invite.inviter.id).then(async inviter => {

            const Inviter = inviter.username + "#" + inviter.discriminator

            return Channel.send({
                embeds: [
                    Embed.setDescription(`${user.tag} has joined the server using invite code: ${invite.code} sent by ${Inviter}. The code has been used a total of ${invite.uses} times!`)
                ]
            })
        }).catch(err => { })
    }).catch(err => {

        if (err.code !== 50013) return console.log(err)
    })
})