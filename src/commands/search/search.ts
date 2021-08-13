import { MessageEmbed, ApplicationCommandOption } from 'discord.js'
import fetch from 'node-fetch'
import { fetchDocResult, nodeSearch, npmSearch } from './util'

import type { Command, MDNDocument } from '../../types/'

const query: ApplicationCommandOption = 
{
        name: 'query',
        description: 'Search query',
        type: 'STRING',
        required: true
}

const command: Command = {
    name: 'search',
    description: 'Search',
    options: [
        {
            name: 'mdn',
            description: 'search mdn',
            type: 'SUB_COMMAND',
            options: [query]
        },
        {
            name: 'node',
            description: 'search nodejs docs',
            type: 'SUB_COMMAND',
            options: [query]
        },
        {
            name: 'npm',
            description: 'search npm',
            type: 'SUB_COMMAND',
            options: [query,
            {
                name: 'version',
                description: 'Version',
                type: 'STRING'
            }]
        },
        {
            name: 'djs',
            description: 'search djs docs',
            type: 'SUB_COMMAND',
            options: [query,
            {
                name: 'source',
                description: 'Docs source',
                type: 'STRING',
                choices: [
                    {
                        name: 'Stable',
                        value: 'stable'
                    },
                    {
                        name: 'Master',
                        value: 'master'
                    },
                    {
                        name: 'Collection',
                        value: 'collection'
                    },
                    {
                        name: 'RPC',
                        value: 'rpc'
                    }
                ]
            }]
        }
    ],
    async exec(interaction) {
        const q = interaction.options.getString('query')!

        switch(interaction.options.getSubcommand()) {
            case 'mdn':
                const base = `https://developer.mozilla.org`
                const url = `${base}/api/v1/search?q=${q}`
                const { documents }: { documents: MDNDocument[] } = await fetch(url).then(res=>res.json())
                if(!documents.length) return interaction.reply({ content: `No results found for: ${q}`, ephemeral: true })

                const {
                    title,
                    mdn_url,
                    summary
                } = documents[0]

                const mdn_embed = new MessageEmbed()
                    .setAuthor('MDN', 'https://avatars.githubusercontent.com/u/7565578?s=280&v=4', base)
                    .setTitle(title)
                    .setURL(base + mdn_url)
                    .setDescription(summary.replace(/\n/g, '').replace(/(\|{2})/g, '\\$1'))

                return interaction.reply({ embeds: [mdn_embed] })
            case 'djs':
                const source = interaction.options.getString('source') || 'stable'
                const res = await fetchDocResult(source, q)
                if(!res) return interaction.reply({ content: `No results found for: ${q}`, ephemeral: true })

                return interaction.reply({ content: res })

            case 'node':
                const node_res = await nodeSearch(q)
                if(!node_res) return interaction.reply({ content: `No resuls found for: ${q}`, ephemeral: true })

                return interaction.reply({ content: node_res })

            case 'npm':
                const npm_embed = await npmSearch(q, interaction.options.getString('version')!)
                if(!npm_embed) return interaction.reply({ content: `No results found for: ${q}`, ephemeral: true })

                return interaction.reply({ embeds: [npm_embed] })
        }

    }
}

export default command