import { Client, IntentsBitField } from "discord.js"
import dotenv from "dotenv"

import importCommands from "./imports/commands"
import { handleInteraction } from "./handlers/command_handler"
import { handleMessage } from "./handlers/message_handler"

// INIT
dotenv.config()

export const client = new Client({
    intents: [
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
    ]
})

const token = process.env.BOT_TOKEN
if (!token) throw new Error("No bot token provided!")

// FUNCTIONALITY

client.on("ready", async () => {
    console.log("Starting bot...")

    const promises: Promise<any>[] = []

    promises.push(importCommands())

    await Promise.all(promises)

    console.log(`Logged in as ${client.user?.tag}!`)
})

client.on("interactionCreate", (interaction) => {
    handleInteraction(interaction)
})

client.on("messageCreate", (message) => {
    handleMessage(message)
})

client.login(token)