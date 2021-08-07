import type Command from '../../types/Command'

const command: Command = {
    name: 'ping',
    description: 'pong',
    async exec(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true })
    }
}

export default command