import type Command from '../../types/Command'

const command: Command = {
    name: 'ping',
    description: 'pong',
    options: [
        {
            name: 'ephemeral',
            description: 'Silent Send',
            type: 'BOOLEAN',
        }
    ],
    async exec(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: interaction.options.getBoolean('ephemeral') ?? true })
    }
}

export default command