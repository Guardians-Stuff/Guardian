const Discord = require('discord.js')
const Mongoose = require('mongoose');

const ExpiringDocumentManager = require('./Classes/ExpiringDocumentManager');
const EmbedGenerator = require('./Functions/embedGenerator');
const { loadEvents } = require('./Handlers/eventHandler');
const { pickUnique } = require('./Functions/pickUnique');
const config = require('./config.json');

const Infractions = require('./Schemas/Infractions');
const Giveaways = require('./Schemas/Giveaways');

const client = new Discord.Client({
    intents: [ Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildMessages ],
    partials: [ Discord.Partials, Discord.Partials.Message, Discord.Partials.GuildMember, Discord.Partials.ThreadMember ]
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
        if(guild){
            /** @type {Discord.TextChannel} */ const channel = await guild.channels.fetch(giveaway.channel).catch(() => null);
            if(channel){
                const message = await channel.messages.fetch({ message: giveaway.giveaway }).catch(() => null);
                if(message){
                    /** @type {Array<String>} */ const winners = pickUnique(giveaway.entries, giveaway.winners);

                    const embed = new Discord.EmbedBuilder(message.embeds[0].data);
                    embed.setDescription([
                        giveaway.description ? giveaway.description : null,
                        giveaway.description ? '' : null,
                        `Winners: **${giveaway.winners}**, Entries: **${giveaway.entries.length}**`,
                        `Status: Ended`
                    ].filter(text => text !== null).join('\n'));

                    await message.edit({ embeds: [ embed ], components: [] });

                    if(winners.length == 0){
                        await channel.send({
                            embeds: [ EmbedGenerator.errorEmbed(`💔 | Nobody entered the giveaway, there are no winners!`) ],
                            reply: { messageReference: message }
                        });
                    }else{
                        await channel.send({
                            content: winners.map(id => `<@${id}>`).join(' '),
                            embeds: [ EmbedGenerator.basicEmbed(`Congratulations winners!`) ],
                            reply: { messageReference: message }
                        });
                    }
                }
            }

        }

        giveaway.active = false;
        await giveaway.save();
    }, { active: true })
};

Mongoose.connect(config.DatabaseURL).then(async () => {
    console.log('Client is connected to the database.');

    await loadEvents(client);
    client.login(config.token).then(() => {
        client.user.setActivity(`with ${client.guilds.cache.size} servers!`)
    });
});