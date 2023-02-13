const Discord = require('discord.js');
const Moment = require('moment');
const Express = require('express');
const fs = require('fs');

const index = require('./index');
const Tickets = require('./Schemas/Tickets');
const Infractions = require('./Schemas/Infractions');

const router = Express.Router();

router.use((req, res, next) => {
    if(!req.headers.authorization) return res.sendStatus(403);
    if(req.headers.authorization != `Bearer ${process.env.DISCORD_TOKEN}`) return res.sendStatus(401);

    next();
});

router.get('/api/commands', async (req, res) => {
    const commands = [];

    for(var command of index.client.commands.values()){
        commands.push({
            name: command.data.name,
            description: command.data.description,
            category: command.category,
            subcommands: command.subCommands?.map(subcommand => {
                return {
                    name: subcommand.data.name,
                    description: subcommand.data.description
                }
            }) || []
        });
    }

    res.status(200).json(commands);
});


router.get('/api/guilds', async (req, res) => {
    const guilds = await index.client.guilds.fetch().catch(() => null);
    if(!guilds) return res.sendStatus(500);

    res.status(200).json(guilds.map(guild => {
        return {
            id: guild.id,
            name: guild.name,
            iconURL: guild.iconURL(),
            owner: guild.owner
        }
    }));
});

router.get('/api/guilds/:guild', async (req, res) => {
    if(!req.params.guild) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if(!guild) return res.sendStatus(404);

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
        roles: guild.roles.cache.size
    })
});

router.get('/api/guilds/:guild/members', async (req, res) => {
    if(!req.params.guild) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if(!guild) return res.sendStatus(404);

    const members = await guild.members.fetch().catch(() => null);
    if(!members) return res.sendStatus(500);

    res.status(200).json(members.map(member => {
        return {
            id: member.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            displayAvatarURL: member.user.displayAvatarURL({ forceStatic: true }),

            nickname: member.nickname,
            guildDisplayAvatarURL: member.displayAvatarURL({ forceStatic: true }),

            createdAt: member.user.createdTimestamp,
            joinedAt: member.joinedTimestamp
        }
    }));
});

router.get('/api/guilds/:guild/members/:member', async (req, res) => {
    if(!req.params.guild) return res.sendStatus(400);
    if(!req.params.member) return res.sendStatus(400);

    const guild = await index.client.guilds.fetch({ guild: req.params.guild }).catch(() => null);
    if(!guild) return res.sendStatus(404);

    const member = await guild.members.fetch({ user: req.params.member }).catch(() => null);
    if(!member) return res.sendStatus(404);

    res.status(200).json({
        id: member.id,
        name: member.displayName,
        discriminator: member.user.discriminator,
        displayAvatarURL: member.user.displayAvatarURL({ forceStatic: true }),

        nickname: member.nickname,
        guildDisplayAvatarURL: member.displayAvatarURL({ forceStatic: true }),

        createdAt: member.user.createdTimestamp,
        joinedAt: member.joinedTimestamp
    });
});

router.get('/infractions/:id/inactive', async (req, res) => {
    if(!req.params.id) return res.sendStatus(400);

    Infractions.findById(req.params.id).then(async infraction => {
        if(!infraction) return res.sendStatus(404);

        if(infraction.type == 'ban') {
            const guild = await index.client.guilds.fetch({ guild: infraction.guild }).catch(() => null);
            if(!guild) return res.sendStatus(500);
            
            guild.members.unban(infraction.user, 'Temporary ban expired').then(() => {
                index.client.expiringDocumentsManager.infractions.removeDocument(infraction);

                res.sendStatus(200);
            }).catch(() => res.sendStatus(500));
        }

        if(infraction.type == 'timeout'){
            const guild = await index.client.guilds.fetch({ guild: infraction.guild }).catch(() => null);
            if(!guild) return res.sendStatus(500);

            const member = await guild.members.fetch({ user: infraction.user }).catch(() => null);
            if(!member) return res.sendStatus(500);

            member.timeout(null).then(() => {
                index.client.expiringDocumentsManager.infractions.removeDocument(infraction);
                
                res.sendStatus(200);
            }).catch(() => res.sendStatus(500));
        }
    }).catch(() => res.sendStatus(400));
});

module.exports = router;