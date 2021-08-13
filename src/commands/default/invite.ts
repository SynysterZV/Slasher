import type { SlashCommand } from '@slasher/client'

const command: SlashCommand = {
    name: 'invite',
    description: 'Invite the bot to your guild',
    options: [
        {
            name: 'ephemeral',
            description: 'Silent Send',
            type: 'BOOLEAN'
        }
    ],
    async exec(interaction) {
        await interaction.reply({ content: `Invite the bot here: ${interaction.client.generateInvite(
            {
                permissions: ['ADMINISTRATOR'],
                scopes: ['applications.commands', 'bot']
            }
        )}`, ephemeral: interaction.options.getBoolean('ephemeral') ?? true })
    }
}

export default command