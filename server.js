// Import required modules
const Discord = require('discord.js');
const Moment = require('moment');
const Express = require('express');
const fs = require('fs');

// Import custom modules
const index = require('./index');
const Tickets = require('./Schemas/Tickets');
const Infractions = require('./Schemas/Infractions');

// Create an Express router object
const router = Express.Router();

router.use((req, res, next) => {
    // Middleware function to validate authorization header
    if (!req.headers.authorization) return res.sendStatus(403);
    if (req.headers.authorization !== `Bearer ${process.env.DISCORD_TOKEN}`)
        return res.sendStatus(401);

    next(); // Proceed to next middleware
});

router.get('/api/commands', async (req, res) => {
    // API route to get a list of commands
    const commands = [];

    for (const command of index.client.commands.values()) {
        // Loop through the commands in the index module
        commands.push({
            name: command.data.name,
            description: command.data.description,
            category: command.category,
            subcommands:
                command.subCommands?.map((subcommand) => {
                    return {
                        name: subcommand.data.name,
                        description: subcommand.data.description,
                    };
                }) || [],
        });
    }

    res.status(200).json(commands); // Send the commands as a JSON response
});

router.get('/api/guilds', async (req, res) => {
    // API route to get a list of guilds
    const guilds = await index.client.guilds.fetch().catch(() => null);
    if (!guilds) return res.sendStatus(500);

    res.status(200).json(
        guilds.map((guild) => {
            return {
                id: guild.id,
                name: guild.name,
                iconURL: guild.iconURL(),
                owner: guild.owner,
            };
        })
    ); // Send the guilds as a JSON response
});

router.get('/api/guilds/:guild', async (req, res) => {
    // API route to get information about a specific guild
    if (!req.params.guild) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if (!guild) return res.sendStatus(404); // Error if guild is not found

    res.status(200).json({
        id: guild.id,
        name: guild.name,
        iconURL: guild.iconURL({ forceStatic: true }),
        owner: guild.ownerId,

        premiumTier: guild.premiumTier,
        premiumSubscriptionCount: guild.premiumSubscriptionCount,

        createdAt: guild.createdTimestamp,
        joinedAt: guild.joinedTimestamp,

        channels: guild.channels.cache.size,
        members: guild.memberCount,
        roles: guild.roles.cache.size,
    }); // Send the guild information as a JSON response
});

router.get('/api/guilds/:guild/members', async (req, res) => {
    // API route to get a list of members in a specific field
    if (!req.params.guild) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if (!guild) return res.sendStatus(404);

    const members = await guild.members.fetch().catch(() => null);
    if (!members) return res.sendStatus(500);

    res.status(200).json(
        members.map((member) => {
            return {
                id: member.id,
                username: member.user.username,
                discriminator: member.user.discriminator,
                displayAvatarURL: member.user.displayAvatarURL({ forceStatic: true }),

                nickname: member.nickname,
                guildDisplayAvatarURL: member.displayAvatarURL({ forceStatic: true }),

                createdAt: member.user.createdTimestamp,
                joinedAt: member.joinedTimestamp,
            };
        })
    ); // Send the members as a JSON response
});

router.get('/api/guilds/:guild/members/:member', async (req, res) => {
    // API route to get information about a specific member in a guild
    if (!req.params.guild) return res.sendStatus(400);
    if (!req.params.member) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if (!guild) return res.sendStatus(404); // Error if Guild is not found

    const member = await guild.members.fetch({ user: req.params.member }).catch(() => null);
    if (!member) return res.sendStatus(404); // Error if Guild is not found

    res.status(200).json({
        id: member.id,
        name: member.displayName,
        discriminator: member.user.discriminator,
        displayAvatarURL: member.user.displayAvatarURL({ forceStatic: true }),

        nickname: member.nickname,
        guildDisplayAvatarURL: member.displayAvatarURL({ forceStatic: true }),

        createdAt: member.user.createdTimestamp,
        joinedAt: member.joinedTimestamp,

        owner: guild.ownerId === member.id,
        administrator: member.permissions.has('Administrator'),
    }); // Send the member information as a JSON response
});

router.get('/infractions/:id/inactive', async (req, res) => {
    // API route to handle inactive instructions
    if (!req.params.id) return res.sendStatus(400);

    Infractions.findById(req.params.id)
        .then(async (infraction) => {
            if (!infraction) return res.sendStatus(404);

            if (infraction.type === 'ban') {
                const guild = await index.client.guilds
                    .fetch({ guild: infraction.guild })
                    .catch(() => null);
                if (!guild) return res.sendStatus(500);

                guild.members
                    .unban(infraction.user, 'Temporary ban expired')
                    .then(() => {
                        index.client.expiringDocumentsManager.infractions.removeDocument(
                            infraction
                        ); // Remove the infraction from the documents manager

                        res.sendStatus(200); // Send success status
                    })
                    .catch(() => res.sendStatus(500)); // Error if unbanning fails
            }

            if (infraction.type === 'timeout') {
                const guild = await index.client.guilds
                    .fetch({ guild: infraction.guild })
                    .catch(() => null);
                if (!guild) return res.sendStatus(500);

                const member = await guild.members
                    .fetch({ user: infraction.user })
                    .catch(() => null);
                if (!member) return res.sendStatus(500);

                member
                    .timeout(null) // Remove the timeout for the member
                    .then(() => {
                        index.client.expiringDocumentsManager.infractions.removeDocument(
                            infraction
                        ); // Remove the infraction from the documents manager

                        res.sendStatus(200); // Send success status
                    })
                    .catch(() => res.sendStatus(500)); // Error if removing timeout fails
            }
        })
        .catch(() => res.sendStatus(400)); // Error if Guild is not found
});

module.exports = router; // Export the router for use in other modules
