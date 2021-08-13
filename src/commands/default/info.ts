import { GuildMember, MessageEmbed, ApplicationCommandOption } from 'discord.js'
import ms from 'pretty-ms'

import type { Command } from '../../types'

const options: ApplicationCommandOption[] = [
    {
        name: 'ephemeral',
        description: 'Silent Send',
        type: 'BOOLEAN'
    }
]

const command: Command = {
    name: 'info',
    description: 'Bot Info',
    options: [
        {
            name: 'user',
            description: 'User info',
            type: 'SUB_COMMAND',
            options
        },
        {
            name: 'bot',
            description: 'Bot info',
            type: 'SUB_COMMAND',
            options
        },
    ],
    async exec(interaction) {

        const embed = new MessageEmbed()

        switch(interaction.options.getSubcommand()) {

            case 'user':
                embed
                .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
                .setFields([
                    {
                        name: 'Joined At',
                        value: `${(interaction.member as GuildMember).joinedAt!}`
                    }
                ])
                break;

            case 'bot':
                embed
                .setFields([
                    {
                        name: 'Uptime',
                        value: ms(interaction.client.uptime!, { secondsDecimalDigits: 0 })
                    },
                    {
                        name: 'API Latency',
                        value: `${interaction.client.ws.ping}ms`
                    }
                ])

        }

        interaction.reply({ embeds: [embed], ephemeral: interaction.options.getBoolean('ephemeral') ?? true })
    }
}

export default command