import { Event } from '../types/Event'

const event: Event = {
    name: 'ready',
    event: 'ready',
    async exec(client): Promise<void> {
        console.log(`Ready! Logged in as ${client.user!.tag}`)
        client.registerCommands({ gid: ['862858334939512862', '806550877439131660'] })
    }
}

export default event