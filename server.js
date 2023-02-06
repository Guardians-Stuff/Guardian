const Discord = require('discord.js');
const Moment = require('moment');
const Express = require('express');
const fs = require('fs');

const index = require('./index');
const Tickets = require('./Schemas/Tickets');

const router = Express.Router();

router.get('/emptyChannelIcon.svg', (req, res) => {
    res.sendFile(`${__dirname}/data/server/emptyChannelIcon.svg`);
});

router.get('/ticket', async (req, res) => {
    if(!req.query.id) return res.sendStatus(400);

    Tickets.findById(req.query.id).then(async ticket => {
        if(!ticket) return res.sendStatus(404);
        /** @type {Map<string, Discord.User | null>} */ const members = new Map();
        for(const member of [ ...new Set(ticket.messages.map(message => message.user)) ]) members.set(member, await index.client.users.fetch(member).catch(() => null));

        const messages = ticket.messages.sort((a, b) => a.time - b.time).map(message => `
            <div clas<div class="message-2qnXI6 cozyMessage-3V1Y8y groupStart-23k01U wrapper-2a6GCs cozy-3raOZG zalgo-jN1Ica">
                <div class="contents-2mQqc9">
                    <img src="${members.get(message.user)?.displayAvatarURL()}" class="avatar-1BDn8e clickable-1bVtEA" alt=" ">
                    <h2 class="header-23xsNx">
                        <span class="username-1A8OIy clickable-1bVtEA focusable-1YV_-H">${members.get(message.user)?.username}(${message.user})</span>
                        <span class="timestamp-3ZCmNB">
                            <span>${Moment(new Date(message.time)).format('DD/MM/YYYY HH:mm:ss')}</span>
                        </span>
                    </h2>
                    <div class="container-1ov-mD">
                        <div class="embedWrapper-lXpS3L" aria-hidden="false" style="border-color: hsl(199, calc(var(--saturation-factor, 1) * 100%), 58.8%);">
                            <div class="grid-1nZz7S">
                                <div class="embedAuthor-3l5luH embedMargin-UO5XwE">
                                    <img alt="" class="embedAuthorIcon--1zR3L" src="${members.get(message.user)?.displayAvatarURL()}">
                                    <span class="embedAuthorName-3mnTWj">${members.get(message.user)?.username}</span>
                                </div>
                                <div class="embedDescription-1Cuq9a embedMargin-UO5XwE">${message.message}</div>
                            </div>
                        </div>${message.images.map(image => ` <div class="messageAttachment-1aDidq">
                            <a tabindex="0" href="${image}" rel="noreferrer noopener" target="_blank" role="button">
                                <img alt="" src="${image}">
                            </a>
                        </div>`)}
                    </div>
                </div>
            </div>
        `);

        res.send(fs.readFileSync(`${__dirname}/data/server/ticketExport.html`, 'utf-8')
            .split('%ticket%').join(members.get(ticket.messages[0].user)?.username.toLowerCase().split(' ').join('-'))
            .split('%time%').join(Moment(new Date(ticket.messages[0].time)).format('DD/MM/YYYY HH:mm:ss'))
            .split('%messages%').join(messages.join('\n'))
        );
    }).catch();
});

router.use((req, res, next) => {
    if(!req.headers.authorization) return res.sendStatus(403);
    if(req.headers.authorization != `Bearer ${process.env.DISCORD_TOKEN}`) return res.sendStatus(401);

    next();
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

module.exports = router;