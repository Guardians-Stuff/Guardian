const {
    Client,
    ChatInputCommandInteraction
} = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "simulate",
    description: "Simulates",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [{
        name: "options",
        description: "Choose an option",
        type: 3,
        required: true,
        choices: [{
                name: "Join",
                value: "join"
            },
            {
                name: "Leave",
                value: "leave"
            }
        ]
    }],

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply({
            ephemeral: true
        })

        const {
            options,
            user,
            member
        } = interaction

        const Options = options.getString("options")

        if (user.id !== "719660045817872394") return EditReply(interaction, "❌", `This command is classified.`)

        switch (Options) {
            case "join": {
                EditReply(interaction, "✅", "Simulated the join event")

                client.emit("guildMemberAdd", member)
            }
            break;

            case "leave": {
                EditReply(interaction, "✅", "Simulated the leave event.")

                client.emit("guildMemberRemove", member)
            }
            break;
        }
    }
}