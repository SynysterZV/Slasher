import { Event } from '../types/Event'
import Command from '../types/Command'

const event: Event = {
    name: 'interactionCreate',
    event: 'interactionCreate',
    async exec(client , interaction): Promise<void> {
        if(!interaction.isCommand()) return
        const cmd: Command | undefined = client.commands.get(interaction.commandName)
        if(!cmd) return
        cmd.exec(interaction)
    }
}

export default event