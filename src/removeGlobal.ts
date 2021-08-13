import { config } from 'dotenv'
import { Client, Intents } from 'discord.js'

config()
const client = new Client({ intents: [Intents.FLAGS.GUILDS] } )

client.on('ready', () => {
    client.application?.commands.set([])
}).login()