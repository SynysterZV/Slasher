import { Client, Intents, ApplicationCommandData, Collection } from 'discord.js'
import { sync } from 'glob'

import type Command from './types/Command'
import type { Event } from './types/Event'

type ExtendSelf<T, U> = T extends T ? U : never;
type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never}
type XOR<T, U> = T | U extends object ? (Without<T,U> & U) | (Without<U,T> & T) : T | U
type ExclusiveOr<T, U> = ExtendSelf<T, XOR<T,U>> 

interface OB {
    commands: ApplicationCommandData[];
}

interface O1 extends OB {
    global: boolean;
}

interface O2 extends OB {
    gid: string;
}

type Opts = ExclusiveOr<O1, O2>


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
                }
            )
        })
    }

    async registerCommands(opts: Opts): Promise<void> {
        if(!this.isReady()) throw new Error('[NOT_READY]: Client needs to logged in before you can set commands')

        opts.global ? this.application.commands.set(opts.commands) : this.guilds.cache.get(opts.gid!)?.commands.set(opts.commands)
    }

    init() {
        this.loadEvents()
        this.loadCommands()
        this.login()
        return this
    }


}