import { Message } from 'discord.js'

import type { Command } from '../../types'

const command: Command = {
    name: 'ping',
    description: 'pong',
    async exec(interaction) {
        interaction.reply({ content: 'Loading...', fetchReply: true }).then(i => {
            interaction.editReply({ content: `**API Latency:** ${interaction.client.ws.ping}ms\n**Round-Trip Latency:** ${(i as Message).createdTimestamp-interaction.createdTimestamp}ms`})
        })
    }
}

export default command