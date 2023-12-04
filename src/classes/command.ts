import { Interaction, SlashCommandBuilder } from "discord.js"
import { client } from ".."

type ExecuteCommand = (interaction: Interaction) => void

export default class Command {
    name: string
    description: string
    execute: ExecuteCommand
    command: SlashCommandBuilder

    constructor(name: string, description: string, execute: ExecuteCommand) {
        this.name = name
        this.description = description
        this.execute = execute

        // build slash command
        this.command = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
    }

    setPermission(permission: string) {
        this.command.setDefaultMemberPermissions(permission)
    }
}