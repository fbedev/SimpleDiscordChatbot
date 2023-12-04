import { Interaction } from "discord.js";
import { commands } from "../imports/commands";

export function handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
        command.execute(interaction);
    } catch (error) {
        console.warn(error);

        interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}