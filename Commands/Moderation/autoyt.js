const { CommandInteraction, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const Notifications = require('../../Structures/Schemas/Notifications');
const res = new (require("rss-parser"))();
const path = require('path');

module.exports = {
    name: `autoyt`,
    description: `Add or remove a user from the AUTOYT list`,
    UserPerms: ['ManageRoles'],
    BotPerms: ["ManageRoles"],
    premium: true,
    type: ApplicationCommandType.ChatInput,
    options: [{
        name: `add`,
        description: `Add a user to the AUTOYT list`,
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: `username`,
            description: `The user who you would like to add`,
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: `channelid`,
            description: `The ID of the user's YouTube channel`,
            type: ApplicationCommandOptionType.String,
            required: true
        }],
    },
    {
        name: `remove`,
        description: `Remove a user from the AUTOYT list`,
        type: ApplicationCommandOptionType.Subcommand,
        options: [{
            name: `username`,
            description: `The user who you would like to remove`,
            type: ApplicationCommandOptionType.User,
            required: true
        }],
    }],
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction;

        switch (options.getSubcommand()) {
            case 'add': {
                const target = options.getMember('username');
                const channelId = options.getString('channelid');

                try {
                    // we need to store a list of the user's current video IDs
                    const resolve = await res.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
                    const items = resolve.items;

                    let videoIdArr = [];

                    items.forEach(item => {
                        // remove the XML markup from video IDs
                        const regex = item.id.replace('yt:video:', '');

                        videoIdArr.push(regex);
                    })

                    await Notifications.updateOne({
                        userId: target.id,
                    }, {
                        userId: target.id,
                        channelId: channelId,
                        videoIds: videoIdArr
                    }, {
                        upsert: true
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem updating a database entry: `, err));

                    interaction.reply({
                        content: `${target}, with YouTube channel ID '${channelId}', has been added to the AUTOYT list`,
                        ephemeral: true
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
                } catch {
                    // if the supplied channel ID is incorrect
                    interaction.reply({
                        content: `An error occurred. This is most likely because the channel ID doesn't exist`,
                        ephemeral: true
                    }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));
                }

                break;
            }

            case 'remove': {
                const target = options.getMember('username');

                await Notifications.findOneAndRemove({ userId: target.id })
                    .catch(err => console.error(`${path.basename(__filename)} There was a problem removing a database entry: `, err));

                interaction.reply({
                    content: `${target} has been removed from the AUTOYT list`,
                    ephemeral: true
                }).catch(err => console.error(`${path.basename(__filename)} There was a problem sending an interaction: `, err));

                break;
            }
        }
    }
}