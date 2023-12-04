import Command from "../classes/command";

export default new Command("ping", "Replies with pong!", (interaction) => {
    if (!interaction.isCommand()) return;

    const latency = Date.now() - interaction.createdTimestamp;

    interaction.reply("Pong! ( " + latency + "ms )");
});