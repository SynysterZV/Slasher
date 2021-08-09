import { Client, Intents, ApplicationCommandData, Collection } from 'discord.js'
import { sync } from 'glob'

import type Command from './types/Command'
import type { Event } from './types/Event'


export default class extends Client {

    public commands

    constructor() {
        super({ intents: Intents.FLAGS.GUILDS })
        this.commands = new Collection<string, Command>()
    }

    loadCommands(): void {
        sync('dist/commands/**/*.js', { absolute: true }).forEach(i => {
            import(i).then(({ default: command }: { default: Command }) => {
                this.commands.set(command.name, command)
            })
        })
    }

    loadEvents(): void {
        sync('dist/events/**/*.js', { absolute: true }).forEach(i => {
            import(i).then(({ default: event }: { default: Event }) => {
                // @ts-expect-error 
                this.on(event.name, event.exec.bind(null, this))
            })
        })
    }

    async registerCommands({ gid }: { gid: string | Array<string> }): Promise<void> {
        if(!this.isReady()) throw new Error('[NOT_READY]: Client needs to logged in before you can set commands')

        const cmds: ApplicationCommandData[] = this.commands.map(x=>x)

        gid ? [gid].flat().forEach(i=>this.guilds.cache.get(i)?.commands.set(cmds)) : this.application.commands.set(cmds)
    }

    init() {
        this.loadEvents()
        this.loadCommands()
        this.login()
        return this
    }


}