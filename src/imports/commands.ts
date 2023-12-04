// import all the commands

import fs from "fs"
import path from "path"

import Command from "../classes/command"
import { REST, Routes } from "discord.js"
import dotenv from "dotenv"
import { client } from ".."

dotenv.config()

const botToken = process.env.BOT_TOKEN
const guildId = process.env.GUILD_ID

// MAKE SURE ENV VARS EXIST
if (!botToken) throw new Error("No bot token provided!")
if (!guildId) throw new Error("No guild ID provided!")

export const commands = new Map<string, Command>()
const rest = new REST().setToken(botToken)

async function registerCommands(commands: Map<string, Command>) {
    const commandsJSON = Array.from(commands.values()).map(command => command.command.toJSON())

    try {
        const data: any = await rest.put(
            Routes.applicationGuildCommands(client.user!.id, guildId!),
            { body: commandsJSON }
        )

        console.log(`Successfully registered application ${data.length} commands.`)
    } catch (error) {
        console.error(error)
    }
}

export default async function () {
    const commandFiles = fs.readdirSync(path.join(__dirname, "..", "commands")).filter(file => file.endsWith(".ts") || file.endsWith(".js"))

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`).default
        commands.set(command.name, command)
    }

    // wait until client ready
    await registerCommands(commands)

    return commands
}