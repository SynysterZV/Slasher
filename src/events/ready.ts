import { Event } from '../types/Event'

const event: Event = {
    name: 'ready',
    event: 'ready',
    async exec(client): Promise<void> {
        console.log(`Ready! Logged in as ${client.user!.tag}`)
        client.registerCommands({ commands: client.commands.map(x=>x), gid: '862858334939512862' })
    }
}

export default event