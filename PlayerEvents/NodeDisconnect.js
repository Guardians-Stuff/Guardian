const { Client } = require("discord.js")
const { Node } = require("erela.js")

module.exports = {
    name: "nodeDisconnect",

    async execute(node, client) {
        console.log(`Node ${node.options.name} disconnected`)
    }
}