const {
    Client,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require("discord.js");
  const {
    TwoZeroFourEight,
    FastType,
    FindEmoji,
    Flood,
    GuessThePokemon,
    Hangman,
    MatchPairs,
    Minesweeper,
    Slots,
    Snake,
    Trivia,
    Wordle,
    WouldYouRather
  } = require('discord-gamecord');
  const ms = require("ms");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("games-singleplayer")
      .setDescription("Play a single-player minigame within Discord.")
      .addStringOption(option =>
        option.setName("game")
          .setDescription("*Choose a game to play.")
          .setRequired(true)
          .addChoices(
            { name: "2048", value: "2048" },
            { name: "Fast-Type", value: "fasttype" },
            { name: "Find-Emoji", value: "findemoji" },
            { name: "Flood", value: "flood" },
            { name: "Guess-The-Pokemon", value: "guessthepokemon" },
            { name: "Hangman", value: "hangman" },
            { name: "Match-Pairs", value: "matchpairs" },
            { name: "Minesweeper", value: "minesweeper" },
            { name: "Rock-Paper-Scissors", value: "rps" },
            { name: "Slots", value: "slots" },
            { name: "Snake", value: "snake" },
            { name: "Trivia", value: "trivia" },
            { name: "Wordle", value: "wordle" },
            { name: "Would-You-Rather", value: "wouldyourather" },
          )
      )
      .setDMPermission(false),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
      const game = interaction.options.getString("game");
  
      switch (game) {
        case "2048": {
          const Game = new TwoZeroFourEight({
            message: interaction,
            slash_command: true,
            embed: {
              title: '2048',
              ////color: "RED",
            },
            emojis: {
              up: '⬆️',
              down: '⬇️',
              left: '⬅️',
              right: '➡️',
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "fasttype": {
          const Game = new FastType({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Fast Type',
              ////color: 0x2f3136,
              description: 'You have {time} seconds to type the sentence below.'
            },
            timeoutTime: 60000,
            sentence: 'Some really cool sentence to fast type.',
            winMessage: 'You won! You finished the type race in {time} seconds with wpm of {wpm}.',
            loseMessage: 'You lost! You didn\'t type the correct sentence in time.',
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "findemoji": {
          const Game = new FindEmoji({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Find Emoji',
              //color: '#2f3136',
              description: 'Remember the emojis from the board below.',
              findDescription: 'Find the {emoji} emoji before the time runs out.'
            },
            timeoutTime: 60000,
            hideEmojiTime: 5000,
            buttonStyle: 'PRIMARY',
            emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
            winMessage: 'You won! You selected the correct emoji. {emoji}',
            loseMessage: 'You lost! You selected the wrong emoji. {emoji}',
            timeoutMessage: 'You lost! You ran out of time. The emoji is {emoji}',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "flood": {
          const Game = new Flood({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Flood',
              //color: '#2f3136',
            },
            difficulty: 13,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
            winMessage: 'You won! You took **{turns}** turns.',
            loseMessage: 'You lost! You took **{turns}** turns.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "guessthepokemon": {
          const Game = new GuessThePokemon({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Who\'s The Pokemon',
              //color: '#2f3136'
            },
            timeoutTime: 60000,
            winMessage: 'You guessed it right! It was a {pokemon}.',
            loseMessage: 'Better luck next time! It was a {pokemon}.',
            errMessage: 'Unable to fetch pokemon data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "hangman": {
          const theme = [
            "nature",
            "sport",
            "//color",
            "camp",
            "fruit",
            "discord",
            "winter",
            "pokemon"
          ]
  
          const chosenTheme = Math.round((Math.random() * theme.length))
  
          const Game = new Hangman({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Hangman',
              //color: '#2f3136'
            },
            hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
            timeoutTime: 60000,
            theme: `${theme[chosenTheme]}`,
            winMessage: 'You won! The word was **{word}**.',
            loseMessage: 'You lost! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "matchpairs": {
          const Game = new MatchPairs({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Match Pairs',
              //color: '#2f3136',
              description: '**Click on the buttons to match emojis with their pairs.**'
            },
            timeoutTime: 60000,
            emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
            winMessage: '**You won the Game! You turned a total of `{tilesTurned}` tiles.**',
            loseMessage: '**You lost the Game! You turned a total of `{tilesTurned}` tiles.**',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "minesweeper": {
          const Game = new Minesweeper({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Minesweeper',
              //color: '#2f3136',
              description: 'Click on the buttons to reveal the blocks except mines.'
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'You won the Game! You successfully avoided all the mines.',
            loseMessage: 'You lost the Game! Beaware of the mines next time.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "rps": {
          let choices = ["rock", "paper", "scissor"]
          const botchoice = `${choices[(Math.floor(Math.random() * choices.length))]}`
          console.log(`The bot chose ${botchoice}`)
  
          const Embed = new EmbedBuilder()
            .set//color("0x2f3136")
            .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
            .setDescription(`<@${interaction.member.id}> choose your move.`)
  
          const row = new ActionRowBuilder().addComponents(
  
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setCustomId("rock")
              .setLabel("Rock")
              .setEmoji(`✊`),
  
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setCustomId("paper")
              .setLabel("Paper")
              .setEmoji(`✋`),
  
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setCustomId("scissor")
              .setLabel("Scissors")
              .setEmoji(`✌`),
  
          )
  
          const Page = await interaction.reply({
  
            embeds: [Embed],
            components: [row]
          })
          const col = Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: ms("10s")
          })
          col.on("collect", i => {
  
            switch (i.customId) {
  
              case "rock": {
  
                if (botchoice === "rock") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`Game tied\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Rock", inline: true },
                          { name: "My choice", value: "Rock", inline: true }
                        )
                    ],
                    components: []
                  })
                }
  
                if (botchoice === "paper") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You lost the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Rock", inline: true },
                          { name: "My choice", value: "Paper", inline: true }
                        )
                    ],
                    components: []
                  })
                }
                if (botchoice === "scissor") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You won the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Rock", inline: true },
                          { name: "My choice", value: "Scissors", inline: true }
                        )
                    ],
                    components: []
                  })
                }
              }
                break;
              case "paper": {
                if (botchoice === "rock") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You won the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Paper", inline: true },
                          { name: "My choice", value: "Rock", inline: true }
                        )
                    ],
                    components: []
                  })
                }
  
                if (botchoice === "paper") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`Game tied\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Paper", inline: true },
                          { name: "My choice", value: "Paper", inline: true }
                        )
                    ],
                    components: []
                  })
                }
                if (botchoice === "scissor") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You lost the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Paper", inline: true },
                          { name: "My choice", value: "Scissors", inline: true }
                        )
                    ],
                    components: []
                  })
                }
              }
                break;
  
              case "scissor": {
  
                if (botchoice === "rock") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You lost the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Scissors", inline: true },
                          { name: "My choice", value: "Rock", inline: true }
                        )
                    ],
                    components: []
                  })
                }
  
                if (botchoice === "paper") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`You won the game\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Scissors", inline: true },
                          { name: "My choice", value: "Paper", inline: true }
                        )
                    ],
                    components: []
                  })
                }
                if (botchoice === "scissor") {
  
                  return interaction.editReply({
                    embeds: [
                      new EmbedBuilder()
                        .set//color(`0x2f3136`)
                        .setAuthor({ name: "Rock Paper Scissors", iconURL: interaction.member.displayAvatarURL() })
                        .setDescription(`\`\`\`Game tied\`\`\``)
                        .addFields(
                          { name: "Your choice", value: "Scissors", inline: true },
                          { name: "My choice", value: "Scissors", inline: true }
                        )
                    ],
                    components: []
                  })
                }
              }
                break;
            }
          })
          col.on("end", (collected) => {
  
            if (collected.size > 0) return
  
            interaction.editReply({
              embeds: [
                Embed.setDescription(`:warning: | You did not choose your move.`).set//color("0x2f3136")
              ],
              components: []
            })
          })
        }
          break;
        case "slots": {
          const Game = new Slots({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Slot Machine',
              //color: '#2f3136'
            },
            slots: ['🍇', '🍊', '🍋', '🍌']
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "snake": {
          const Game = new Snake({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Snake Game',
              overTitle: 'Game Over',
              //color: '#2f3136'
            },
            emojis: {
              board: '⬛',
              food: '🍎',
              up: '⬆️',
              down: '⬇️',
              left: '⬅️',
              right: '➡️',
            },
            stopButton: 'Stop',
            timeoutTime: 60000,
            snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
            foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          })
        }
          break;
        case "trivia": {
          const Game = new Trivia({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Trivia',
              //color: '#2f3136',
              description: 'You have 60 seconds to guess the answer.'
            },
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            trueButtonStyle: 'SUCCESS',
            falseButtonStyle: 'DANGER',
            mode: 'multiple',  // multiple || single
            difficulty: 'medium',  // easy || medium || hard
            winMessage: 'You won! The correct answer is {answer}.',
            loseMessage: 'You lost! The correct answer is {answer}.',
            errMessage: 'Unable to fetch question data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          })
        }
          break;
        case "wordle": {
          const Game = new Wordle({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Wordle',
              //color: '#2f3136',
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: 'You won! The word was **{word}**.',
            loseMessage: 'You lost! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
          Game.on('gameOver', result => {
            console.log(result);  // =>  { result... }
          });
        }
          break;
        case "wouldyourather": {
          const Game = new WouldYouRather({
            message: interaction,
            slash_command: true,
            embed: {
              title: 'Would You Rather',
              //color: '#2f3136',
            },
            buttons: {
              option1: 'Option 1',
              option2: 'Option 2',
            },
            timeoutTime: 60000,
            errMessage: 'Unable to fetch question data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
  
          Game.startGame();
        }
          break;
      }
    }
  }