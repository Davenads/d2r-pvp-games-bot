const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'games',
        description: 'Shows a list of all available PvP games.'
    },
    {
        name: 'create',
        description: 'Create a PvP game.',
        options: [
            {
                name: 'name',
                description: 'The name of the game',
                type: 3, // String
                required: true
            },
            {
                name: 'region',
                description: 'Select region: NA East, Central, West, or EU',
                type: 3, // String
                required: true
            },
            {
                name: 'password',
                description: 'Password (optional)',
                type: 3, // String
                required: false
            }
        ]
    },
    {
        name: 'remove',
        description: 'Remove a game you created.',
        options: [
            {
                name: 'name',
                description: 'The name of the game to remove',
                type: 3, // String
                required: true
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
