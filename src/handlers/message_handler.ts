import { Message } from "discord.js";
import { chat } from "../util/ai"

let isBusy = false

const roleId = process.env.ROLE_ID
const channelId = process.env.CHANNEL_ID

export async function handleMessage(message: Message) {
    if (message.author.bot) return
    if (isBusy) return

    // Make sure user has requirements
    if (roleId) {
        if (!message.member?.roles.cache.has(roleId)) return
    }

    if (channelId) {
        if (message.channel.id != channelId) return
    }

    isBusy = true
    message.channel.sendTyping()

    await chat(message)

    isBusy = false
}