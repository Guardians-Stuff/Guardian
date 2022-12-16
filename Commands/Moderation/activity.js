const { Client, ChatInputCommandInteraction, ActivityType } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "activity",
    description: "Sets the bot activity",
    UserPerms: ["Administrator"],
    category: "Moderation",
    options: [
        {
            name: "playing",
            description: "Sets activity to playing",
            type: 1,
            options: [
                {
                    name: "activity",
                    description: "Playing",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "watching",
            description: "Sets activity to watching",
            type: 1,
            options: [
                {
                    name: "activity",
                    description: "Watching",
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: "listening",
            description: "Sets activity to listening",
            type: 1,
            options: [
                {
                    name: "activity",
                    description: "Listening",
                    type: 3,
                    required: true
                },
            ]
        },
        {
            name: "competing",
            description: "Sets activity to listening",
            type: 1,
            options: [
                {
                    name: "activity",
                    description: "Listening",
                    type: 3,
                    required: true
                },
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        const { options } = interaction

        switch (options.getSubcommand()) {
            case "playing": {
                await interaction.deferReply()
                const activity = options.getString("activity")

                client.user.setActivity(activity);

                EditReply(interaction, "☑️", `Bot status has been changed to **Playing ${activity}**`)
            }
                break;

            case "watching": {
                await interaction.deferReply()
                const activity = options.getString("activity")

                client.user.setActivity(activity, { type: ActivityType.Watching });

                EditReply(interaction, "☑️", `Bot status has been changed to **Watching ${activity}**`)
            }
                break;

            case "listening": {
                await interaction.deferReply()
                const activity = options.getString("activity")

                client.user.setActivity(activity, { type: ActivityType.Listening });

                EditReply(interaction, "☑️", `Bot status has been changed to **Listening to ${activity}**`)
            }
                break;

            case "competing": {
                await interaction.deferReply()
                const activity = options.getString("activity")

                client.user.setActivity(activity, { type: ActivityType.Competing });

                EditReply(interaction, "☑️", `Bot status has been changed to **Competing in ${activity}**`)
            }
                break;
        }
    }
}