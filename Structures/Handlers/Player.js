module.exports = async (client, PG) => {

    let Loaded = 0

    const EventFiles = await PG(`${process.cwd()}/PlayerEvents/*.js`)

    EventFiles.map(async file => {

        const event = require(file)

        client.player.on(event.name, (...args) => event.execute(...args, client))

        await Loaded++

    })

    if (Loaded !== 0) console.log(`Loaded ${Loaded} player events`)

}