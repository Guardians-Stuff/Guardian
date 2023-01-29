const Discord = require('discord.js');
const Captcha = require("captcha-generator-alphanumeric").default;

const EmbedGenerator = require('../../Functions/embedGenerator');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('verify')
        .setDMPermission(false)
        .setDescription('Start/complete the verification used for the guild.')
        .addStringOption(option => option
            .setName('captcha')
            .setDescription('The captcha from the image you recieved')
            .setMinLength(6)
            .setMaxLength(6)
        ),
    /**
     * 
     * @param {Discord.ChatInputCommandInteraction} interaction
     * @param {Discord.Client} client
     * @param {import('../../Classes/GuildsManager').GuildsManager} dbGuild
     * @param {import('../../Classes/UsersManager').UsersManager} dbUser
     */
    execute(interaction, client, dbGuild, dbUser) {
        if(!dbGuild.verification.enabled) return { embeds: [ EmbedGenerator.errorEmbed('This guild doesn\t have the Verification system enabled.') ], ephemeral: true };
        if(!interaction.member.roles.cache.has(dbGuild.verification.role)) return { embeds: [ EmbedGenerator.errorEmbed('You are already verified.') ], ephemeral: true }
        if(dbGuild.verification.version == 'button') return { embeds: [ EmbedGenerator.errorEmbed('This guild uses a button for verification.') ], ephemeral: true }

        const captcha = interaction.options.getString('captcha');

        if(dbGuild.verification.version == 'command'){
            interaction.member.roles.remove(guild.verification.role, 'Verification completed').catch(() => {
                interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
            }).then(() => {
                interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Verification completed.') ], ephemeral: true });
            });
        }else if(dbGuild.verification.version == 'captcha'){
            if(!dbUser.captcha || !captcha){
                const generatedCaptcha = new Captcha();
                dbUser.captcha = generatedCaptcha.value;

                interaction.user.send({
                    embeds: [
                        EmbedGenerator.basicEmbed('Use the below captcha with the `/verify [captcha]` command in the guild.')
                            .setTitle(`Captcha Verification | ${interaction.guild.name}`)
                            .setImage('attachment://captcha.jpg')
                            .setFooter({ text: 'You may use /verify again to get a new image.' })
                        ],
                    files: [ new Discord.AttachmentBuilder(generatedCaptcha.JPEGStream).setName('captcha.jpg') ]
                }).catch(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.errorEmbed('Failed to send you a DM.') ], ephemeral: true });
                }).then(() => {
                    interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Captcha image sent, check your DMs.') ], ephemeral: true });
                });
            }else{
                if(captcha.toUpperCase() == dbUser.captcha){
                    interaction.member.roles.remove(dbGuild.verification.role, 'Verification completed').catch(() => {
                        interaction.reply({ embeds: [ EmbedGenerator.errorEmbed() ], ephemeral: true });
                    }).then(() => {
                        interaction.reply({ embeds: [ EmbedGenerator.basicEmbed('Verification completed.') ], ephemeral: true });
                    });
                }else{
                    return { embeds: [ EmbedGenerator.errorEmbed('The captcha you provided is incorrect.') ], ephemeral: true };
                }
            }
        }
    }
}