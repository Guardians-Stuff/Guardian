const { Client } = require("discord.js")
const { Node } = require("erela.js")
const { Message } = new Error()

module.exports = {
    name: "nodeError",

    async execute(node, error, client) {
        console.log(`Node ${node.options.name} connected error ${error.toString()}`)
    }
}