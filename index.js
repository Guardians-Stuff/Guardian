const Discord = require('discord.js')
const Mongoose = require('mongoose');
const Moment = require('moment');
const Express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const dotenv = require("dotenv").config()

const ExpiringDocumentManager = require('./Classes/ExpiringDocumentManager');
const EmbedGenerator = require('./Functions/embedGenerator');
const { loadEvents } = require('./Handlers/eventHandler');
const { pickUnique } = require('./Functions/pickUnique');
const config = require('./config.json');
const router = require('./server');

const Infractions = require('./Schemas/Infractions');
const Giveaways = require('./Schemas/Giveaways');
const Reminders = require('./Schemas/Reminders');

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Discord.Partials,
        Discord.Partials.Message,
        Discord.Partials.GuildMember,
        Discord.Partials.ThreadMember,
        Discord.Partials.Reaction
    ]
});

client.commands = new Discord.Collection();
client.subCommands = new Discord.Collection();
client.expiringDocumentsManager = {
    infractions: new ExpiringDocumentManager(Infractions, 'expires', async infraction => {
        if (infraction.type == 'ban') {
            const guild = await client.guilds.fetch({ guild: infraction.guild }).catch(() => null);
            if (guild) guild.members.unban(infraction.user, 'Temporary ban expired').catch(() => null);
        }

        infraction.active = false;
        await infraction.save();
    }, { active: true }),
    giveaways: new ExpiringDocumentManager(Giveaways, 'expires', async giveaway => {
        const guild = await client.guilds.fetch({ guild: giveaway.guild }).catch(() => null);
        if (guild) {
            console.log(guild);
            /** @type {Discord.TextChannel} */ const channel = await guild.channels.fetch(giveaway.channel).catch(() => null);
            if (channel) {
                const message = await channel.messages.fetch({ message: giveaway.giveaway }).catch(() => null);
                if (message) {
                    /** @type {Array<String>} */ const winners = pickUnique(giveaway.entries, giveaway.winners);

                    const embed = new Discord.EmbedBuilder(message.embeds[0].data);
                    embed.setDescription([
                        giveaway.description ? giveaway.description : null,
                        giveaway.description ? '' : null,
                        `Winners: **${giveaway.winners}**, Entries: **${giveaway.entries.length}**`,
                        `Status: Ended`
                    ].filter(text => text !== null).join('\n'));

                    await message.edit({ embeds: [embed], components: [] });

                    if (winners.length == 0) {
                        await channel.send({
                            embeds: [EmbedGenerator.errorEmbed(`💔 | Nobody entered the giveaway, there are no winners!`)],
                            reply: { messageReference: message }
                        });
                    } else {
                        await channel.send({
                            content: winners.map(id => `<@${id}>`).join(' '),
                            embeds: [EmbedGenerator.basicEmbed(`Congratulations winners!`)],
                            reply: { messageReference: message }
                        });
                    }
                }
            }

        }

        giveaway.active = false;
        await giveaway.save();
    }, { active: true }),
    reminders: new ExpiringDocumentManager(Reminders, 'expires', async reminder => {
        const user = await client.users.fetch(reminder.user);
        if (user) {
            const embed = EmbedGenerator.basicEmbed(reminder.reminder).setAuthor({ name: 'Guardian Reminder', iconURL: client.user.displayAvatarURL() });
            if (reminder.repeating) {
                const ends = Moment().add(reminder.duration);
                embed.setDescription(`${embed.data.description}\n\nYou will be reminded again in <t:${ends.unix()}:R>(<t:${ends.unix()}:f>)`);
            }

            await user.send({ embeds: [embed] });
        }

        if (reminder.repeating) {
            reminder.time = Date.now();
            reminder.expires = reminder.time + reminder.duration;

            return await reminder.save();
        } else {
            await reminder.delete();
        }
    })
};

const app = Express();
let server;

if (config.live) {
    server = https.createServer({ key: fs.readFileSync(`${__dirname}/data/server/privkey.pem`), cert: fs.readFileSync(`${__dirname}/data/server/fullchain.pem`) }, app);
} else {
    server = http.createServer(app);
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});
app.use('/', router);

module.exports.client = client;
module.exports.server = server;

Mongoose.connect(process.env.DatabaseURL).then(async () => {
    console.log('Client is connected to the database.');

    await loadEvents(client);
    //client.login(config.token).then(() => {
    // client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
    client.login(process.env.token).then(() => {
    });
});