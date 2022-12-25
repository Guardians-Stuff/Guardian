const configDatabase = require("../Schemas/MemberLog")

async function loadConfig(client) {
    (await configDatabase.find()).forEach((doc) => {
        client.guildConfig.set(doc.Guild, {
            logChannel: doc.logChannel,
            memberRole: doc.memberRole,
            botRole: doc.botRole
        })
    })

    return console.log("Loaded Guild Configs to the Collection.")
}

module.exports = { loadConfig }