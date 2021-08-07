import { ClientEvents } from 'discord.js'
import Client from '../client'

type Event = {
    [K in keyof ClientEvents]: {
        name: string;
        event: K;
        exec(client: Client, ...args: ClientEvents[K]): Promise<void>;
    }
}[keyof ClientEvents]

export { Event }