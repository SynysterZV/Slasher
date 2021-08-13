import { Event } from '@slasher/client'

const event: Event = {
    name: 'ready',
    event: 'ready',
    async exec(client): Promise<void> {
        console.log(`Ready! Logged in as ${client.user!.tag}`)
    }
}

export default event