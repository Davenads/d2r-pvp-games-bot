# D2R PvP Games Bot

The **D2R PvP Games Bot** is a Discord bot designed for the Diablo 2 Resurrected community, allowing players to create, list, and manage Player vs. Player (PvP) game lobbies across multiple Discord servers. The bot provides a shared database of PvP games that can be accessed from any server where the bot is deployed, making it easy for players to find and join PvP games.

## Features
- **/games**: Displays a list of all currently available PvP games with details such as game name, region, creator, and password (if any).
- **/create**: Allows users to create a new PvP game with a game name, region, and optional password.
- **/remove**: Allows users to remove a PvP game that they have created.
- Only users with the `@PvP Games` role can interact with the bot commands.
- Game data is shared across all Discord servers where the bot is deployed, thanks to a centralized MongoDB database.

## Getting Started

### Prerequisites
- **Node.js** (v16.6.0 or later)
- **npm** (Node Package Manager)
- A **Discord bot token** (You can create one via the [Discord Developer Portal](https://discord.com/developers/applications))
- A **MongoDB Atlas** account for the database (Free tier available at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/d2r-pvp-games-bot.git
   cd d2r-pvp-games-bot
