# 🛡️ Guardian Discord Bot

**Guardian** is a comprehensive Discord bot built with Discord.js v14, designed to provide powerful moderation tools, fun interactions, and essential server management features. With an extensive command system and customizable settings, Guardian helps keep your Discord server safe, organized, and entertaining.

**Version:** `1.7.0`  
**License:** Apache 2.0  
**Developer:** Guardians-Stuff

---

## ✨ Features Overview

Guardian offers a wide range of features including:

- **🔨 Moderation Tools** - Ban, kick, warn, timeout, message management, and comprehensive logging
- **⚙️ Administrator Features** - Anti-raid protection, verification systems, auto-roles, ticket system, and more
- **🎮 Fun Commands** - Interactive games, entertainment commands, and community engagement tools
- **📊 Information Commands** - Server, user, and bot information utilities
- **🔧 Utility Features** - Reminders, AFK status, calculator, and various helpful tools
- **🔄 Backup System** - Create and manage server backups

---

## 🏗️ Technical Stack

- **Node.js** - Runtime environment
- **Discord.js v14.7.1** - Discord API wrapper
- **MongoDB + Mongoose 6.8.1** - Database and ODM
- **Moment.js** - Date/time manipulation

---

## 📋 Prerequisites

Before installing Guardian, make sure you have:

- **Node.js** (v18.8 or higher recommended)
- **MongoDB** database (local or cloud-hosted)
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- **Git** (for cloning the repository)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Guardians-Stuff/Guardian.git
cd Guardian
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 3: Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
DISCORD_TOKEN=your_discord_bot_token_here
MONGODB_URL=your_mongodb_connection_string_here
LIVE=false
```

**Environment Variables Explained:**

- **`DISCORD_TOKEN`** - Your Discord bot token from the Developer Portal
  - Get it from: https://discord.com/developers/applications
  - Select your application → Bot → Reset Token/Copy Token

- **`MONGODB_URL`** - Your MongoDB connection string
  - Local: `mongodb://localhost:27017/guardian`
  - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/guardian`
  - Make sure MongoDB is running if using local instance

- **`LIVE`** - Set to `true` for production with HTTPS, `false` for development
  - When `true`, requires SSL certificates in `data/server/` directory
  - When `false`, uses HTTP on port 2053

### Step 4: Optional - SSL Certificates (Production Only)

If running in production mode (`LIVE=true`), place your SSL certificates:

```
data/server/
  ├── privkey.pem    # Private key
  └── fullchain.pem  # Certificate chain
```

---

## 🚀 Running the Bot

### Development Mode

For development with auto-reload using nodemon:

```bash
npm run dev
```

### Production Mode

For production:

```bash
npm start
```

### What Happens on Start

1. ✅ Connects to MongoDB database
2. ✅ Loads all event handlers
3. ✅ Registers slash commands with Discord
4. ✅ Initializes expiring document managers (infractions, giveaways, reminders)
5. ✅ Logs in to Discord

You should see:
```
Client is connected to the database.
[Commands loaded table]
[Events loaded table]
The client is now ready.
```

---

## ⚙️ Configuration

### Bot Permissions

Ensure your bot has the following permissions:
- **Administrator** (recommended for full functionality)
- Or individually: Manage Roles, Manage Channels, Kick Members, Ban Members, Manage Messages, etc.

### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   # Install MongoDB on your system
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud):**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string
   - Add your IP to whitelist

### Initial Setup

After the bot is running, use the `/setup` command in your Discord server to:
- Check bot permissions
- Verify bot role position
- Configure logging channels
- Initialize basic settings

---

## 🔧 Development

### Available Scripts

- **`npm start`** - Start the bot in production mode
- **`npm run dev`** - Start the bot in development mode (with nodemon)
- **`npm run format`** - Format code using Prettier (requires Docker)
- **`npm run check`** - Check code formatting (requires Docker)

### Code Formatting

The project uses Prettier for code formatting. To format your code:

```bash
npm run format
```

This requires Docker to be installed and running. See [INSTALL.md](./INSTALL.md) for Docker installation instructions.

---

## 🐛 Troubleshooting

### Bot Won't Start

1. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be v18.8 or higher.

2. **Verify MongoDB connection:**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Test connection: `mongosh "your_connection_string"`

3. **Check Discord token:**
   - Verify token is correct in `.env`
   - Ensure bot is enabled in Developer Portal
   - Check bot has proper intents enabled

### Database Connection Issues

- Verify MongoDB is running (if local)
- Check connection string format
- Ensure network access (if using Atlas)
- Check firewall settings

### Commands Not Appearing

- Wait a few minutes for Discord to sync (can take up to 1 hour)
- Re-invite bot with proper permissions
- Check bot is online in your server

---

## 📚 Additional Documentation

- **[INSTALL.md](./INSTALL.md)** - Docker installation guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contributing guidelines
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** - Code of conduct

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Code style guidelines
- How to submit pull requests
- Reporting bugs
- Proposing features

---

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](./LICENSE) file for details.

---

## 🔗 Links

- **GitHub Repository:** [Guardians-Stuff/Guardian](https://github.com/Guardians-Stuff/Guardian)
- **Invite Bot:** [Invite Guardian to your server](https://discord.com/oauth2/authorize?client_id=1130480504097996832&scope=bot)

---

## 🙏 Acknowledgments

- **Developer:** Brennan / Guardians-Stuff
- **Community:** Thanks to all users and contributors who supported Guardian

---

<div align="center">

**⭐ Star this repo if you found it helpful! ⭐**

Made with ❤️ by the Guardian team

</div>
