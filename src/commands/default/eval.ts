import { inspect } from 'util'
import type { SlashCommand } from '@slasher/client'

const command: SlashCommand = {
    name: 'eval',
    description: 'evaluate code',
    options: [
        {
            name: 'code',
            description: 'code to evaluate',
            type: 'STRING',
            required: true
        },
        {
            name: 'return',
            description: 'automatic return?',
            type: 'BOOLEAN'
        }
    ],
    async exec(interaction) {
        if(interaction.user.id != '372516983129767938') return interaction.reply('You arent me.')

        let code = /(`{1,3})?(?:js)?(?<c>.*)\1/.exec(interaction.options.getString('code')!)?.groups?.c
        let evaled

        try {
            evaled = await eval(`( async () => {
                ${ interaction.options.getBoolean('return') ?? true ? 'return' : ''} ${code}
            })()`)
        } catch (e) {
            return await interaction.reply({ content: `\`ERROR\`\n\`\`\`xl\n${e}\`\`\``})
        }

        evaled = typeof evaled == 'string' ? `'${evaled}'` : inspect(evaled, { depth: 0 })

        interaction.reply({ content: `\`\`\`js\n${evaled}\n\`\`\``})
    }
}

export default command