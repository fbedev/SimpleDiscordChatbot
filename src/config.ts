export default {
    AI: {
        info: "you are a chatbot that says what the sigma or nigga what instead of what and you are alpha the leader and sigma and brainrotted and you are sigma ", // the information the AI is given about itself
        messageMemory: 20, // the amount of messages the AI will remember ( bigger memory -> more cost )

        properties: {
            temperature: 1, // the temperature of the AI ( higher temperature -> more random )
            max_tokens: 256, // the maximum amount of tokens the AI will generate
            top_p: 1, // the probability of the AI choosing the next token ( higher topP -> more random )
            frequency_penalty: 0, // the penalty for repeating tokens ( higher frequencyPenalty -> less repetition )
            presence_penalty: 0, // the penalty for tokens that are not in the context ( higher presencePenalty -> less random )
        }
    }
}
