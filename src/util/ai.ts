import OpenAI from "openai";
import dotenv from "dotenv"

// INIT
dotenv.config()

import config from "../config"
import { Message } from "discord.js";
import { Stream } from "openai/streaming";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// FUNCTIONALITY

const preprompt: OpenAI.Chat.ChatCompletionMessageParam = { role: "system", content: config.AI.info }
const messageMemory: OpenAI.Chat.ChatCompletionMessageParam[] = []

async function stream(response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>, message: Message, cb: (text: string) => void) {
    const buffer: OpenAI.Chat.Completions.ChatCompletionChunk[] = []

    let retry = 0
    let replyMessage: Message | undefined = undefined
    let text = ""
    const timeout = 500

    async function handle() {
        if (retry > 10) return
        if (buffer.length == 0) { setTimeout(handle, timeout); retry++; return }
        retry = 0

        const chunks = buffer.splice(0, buffer.length)
        const lastChunk = chunks[chunks.length - 1]

        if (!chunks) { setTimeout(handle, timeout); return }

        text += chunks.map(chunk => chunk.choices[0].delta.content || "").join("")
        if (!text) { setTimeout(handle, timeout); return }

        if (replyMessage) {
            await replyMessage.edit(text)
        } else {
            replyMessage = await message.reply(text)
        }

        if (lastChunk.choices[0].finish_reason == "stop") {
            cb(text)
            return
        }

        // wait a second
        setTimeout(handle, timeout)
    }

    handle()

    for await (const chunk of response) {
        // console.log("Chunk Received: " + chunk.choices[0].delta.content)

        buffer.push(chunk)
    }
}

function streamAsync(response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>, message: Message): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            stream(response, message, (text) => { resolve(text) })
        } catch (error: any) {
            reject(error as string)
        }
    })
}

function limitMemory() {
    // ensure messageMemory is maintained
    const memoryLimit = config.AI.messageMemory

    if (messageMemory.length > memoryLimit) {
        messageMemory.splice(0, messageMemory.length - memoryLimit)
    }
}

export async function chat(message: Message) {
    if (message.author.bot) return;

    const input = message.content
    const username = message.author.displayName

    // add input
    messageMemory.push({
        role: "user",
        content: username + " said " + input
    })

    limitMemory()

    // get response
    const properties = config.AI.properties
    const response = await openai.chat.completions.create({
        messages: [preprompt, ...messageMemory],
        model: "gpt-3.5-turbo",
        stream: true,

        ...properties,
    }, { stream: true })


    try {
        const reply = await streamAsync(response, message)

        // add response
        messageMemory.push({
            role: "system",
            content: reply
        })
    } catch (error) {
        console.warn(error)
        message.reply("There was an error while executing this command!\n```\n" + error + "\n```")
    }
}