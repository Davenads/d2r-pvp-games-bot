require('dotenv').config();
const { MongoClient } = require('mongodb'); // Import MongoDB client
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// MongoDB setup
const mongoUri = process.env.MONGODB_URI; // URI for MongoDB
const clientMongo = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let gamesCollection;

// Discord client setup
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Connect to MongoDB and set the collection when the bot is ready
client.once('ready', async () => {
    try {
        // Connect to the MongoDB client
        await clientMongo.connect();
        console.log('Connected to MongoDB');

        // Set the collection to 'games'
        const database = clientMongo.db('d2r-pvp');
        gamesCollection = database.collection('games');

        console.log(`Logged in as ${client.user.tag}`);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
});

// Handle interactions (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member } = interaction;

    // Check if the user has the @PvP Games role
    if (!member.roles.cache.some(role => role.name === 'PvP Games')) {
        await interaction.reply('You do not have the required role to use these commands.');
        return;
    }

    if (commandName === 'games') {
        // Fetch all games from the MongoDB collection
        const gamesList = await gamesCollection.find().toArray();

        if (gamesList.length === 0) {
            await interaction.reply('No PvP games are currently available.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Available PvP Games')
            .setColor(0x00AE86);

        gamesList.forEach((game, index) => {
            embed.addFields({
                name: `${index + 1}. ${game.name}`,
                value: `Region: ${game.region}\nCreated by: ${game.creator}\nPassword: ${game.password || 'No password'}\nCreated at: ${game.createdAt}`
            });
        });

        embed.setFooter({ text: 'Commands: /games, /create, /remove' });

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'create') {
        const name = options.getString('name');
        const region = options.getString('region');
        const password = options.getString('password');

        // Check if a game with the same name already exists in the database
        const existingGame = await gamesCollection.findOne({ name });
        if (existingGame) {
            await interaction.reply('A game with this name already exists. Please choose a different name.');
            return;
        }

        // Create a new game entry
        const newGame = {
            name: name,
            region: region,
            password: password,
            creator: interaction.user.tag,
            createdAt: new Date().toLocaleString()
        };

        // Insert the game into MongoDB
        await gamesCollection.insertOne(newGame);
        await interaction.reply(`Game "${name}" created by ${interaction.user.tag} in region ${region}.`);
    }

    if (commandName === 'remove') {
        const name = options.getString('name');

        // Find and delete the game by name and creator
        const result = await gamesCollection.deleteOne({ name: name, creator: interaction.user.tag });

        if (result.deletedCount === 0) {
            await interaction.reply('Either the game does not exist, or you are not the creator.');
            return;
        }

        await interaction.reply(`Game "${name}" has been removed.`);
    }
});

// Login to Discord with your bot token
client.login(process.env.TOKEN);
