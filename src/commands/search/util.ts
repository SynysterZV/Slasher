import { MessageEmbed } from 'discord.js'
import Doc from 'discord.js-docs'
import Turndown from 'turndown'
import fetch from 'node-fetch'

import type { NPMPackage } from '../../types'

const API_BASE_NODE = "https://nodejs.org"
const API_DOCS_NODE = `${API_BASE_NODE}/dist/latest/docs/api`

const td = new Turndown({ codeBlockStyle: 'fenced' })

function escapeMDLinks(s=''): string {
    return s.replace(/\[(.+?)\]\((.+?)\)/g, '[$1](<$2>)');
}

function formatInheritance(prefix: string, inherits: DocElement[], doc: Doc): string {
    const res = inherits.map((element: any) => element.flat(5));
    return ` (${prefix} ${res.map((element) => escapeMDLinks(doc.formatType(element))).join(' and ')})`
}

function resolveElementString(element: DocElement, doc: Doc): string {
	const parts = [];
	if (element.docType === 'event') parts.push('**(event)** ');
	if (element.static) parts.push('**(static)** ');
	parts.push(`__**${escapeMDLinks(element.link ?? '')}**__`);
	if (element.extends) parts.push(formatInheritance('extends', element.extends, doc));
	if (element.implements) parts.push(formatInheritance('implements', element.implements, doc));
	if (element.access === 'private') parts.push(' **PRIVATE**');
	if (element.deprecated) parts.push(' **DEPRECATED**');

	const s = escapeMDLinks(element.formattedDescription ?? element.description ?? '').split('\n');
	const description = s.length > 1 ? `${s[0]} [(more...)](<${element.url ?? ''}>)` : s[0];

	return `${parts.join('')}\n${description}`;
}

type QueryType = 'class' | 'classMethod' | 'method' | 'event' | 'module' | 'global' | 'misc';

function urlReplacer(_: string, label: string, link: string) {
	link = link.startsWith('http') ? link : `${API_BASE_NODE}/api/${link}`;
	return `[${label}](<${link}>)`;
}

function findRec(o: any, name: string, type: QueryType, module?: string, source?: string): any {
	name = name.toLowerCase();
	if (!module) module = o?.type === 'module' ? o?.name.toLowerCase() : undefined;
	if (o?.name?.toLowerCase() === name && o?.type === type) {
		o.module = module;
		return o;
	}
	o._source = source;
	for (const prop of Object.keys(o)) {
		if (Array.isArray(o[prop])) {
			for (const entry of o[prop]) {
				const res = findRec(entry, name, type, module, o.source ?? o._source);
				if (res) {
					o.module = module;
					return res;
				}
			}
		}
	}
}

let data: any = null;

function formatForURL(text: string): string {
	return text
		.toLowerCase()
		.replace(/ |`|\[|\]|\)/g, '')
		.replace(/\.|\(|,|:/g, '_');
}

function formatAnchor(text: string, module: string): string {
	return `#${formatForURL(module)}_${formatForURL(text)}`;
}

function parseNameFromSource(source?: string): string | null {
	if (!source) return null;
	const reg = /.+\/api\/(.+)\..*/g;
	const match = reg.exec(source);
	return match?.[1] ?? null;
}

function findResult(data: any, query: string) {
	for (const category of ['class', 'classMethod', 'method', 'event', 'module', 'global', 'misc'] as QueryType[]) {
		const res = findRec(data, query, category);
		if (res) {
			return res;
		}
	}
}

export async function nodeSearch(query: string): Promise<string | null> {
    query = query.trim();
    try {
		if (!data) {
			data = await fetch(`${API_DOCS_NODE}/all.json`).then((r) => r.json());
		}

		const queryParts = query.split(/#|\.|\s/);
		const altQuery = queryParts[queryParts.length - 1];
		const result = findResult(data, query) ?? findResult(data, altQuery);

        if(!result) return null

		const moduleName = result.module ?? result.name.toLowerCase();
		const moduleURL = `${API_BASE_NODE}/api/${
			parseNameFromSource(result.source ?? result._source) ?? formatForURL(moduleName as string)
		}`;
		const anchor = ['module', 'misc'].includes(result.type) ? '' : formatAnchor(result.textRaw, moduleName as string);
		const fullURL = `${moduleURL}.html${anchor}`;
		const parts = [`\ __[**${result.textRaw as string}**](<${fullURL}>)__`];

		const intro = td.turndown(result.desc ?? '').split('\n\n')[0];
		const linkReplaceRegex = /\[(.+?)\]\((.+?)\)/g;
		const boldCodeBlockRegex = /`\*\*(.*)\*\*`/g;

		parts.push(intro.replace(linkReplaceRegex, urlReplacer).replace(boldCodeBlockRegex, '**`$1`**'));
        return parts.join('\n')
	} catch (error) {
        console.log(error)
	}

    return null
}

export async function fetchDocResult(source: string, query: string): Promise<string | null> {
	const doc = await Doc.fetch(source, { force: true })
    const element = doc.get(...query.split(/\.|#/));
	if (!element) return null;
	return resolveElementString(element, doc)
}

export async function npmSearch(query: string, version: string): Promise<MessageEmbed | null> {
	const npm_res: NPMPackage = await fetch(`https://registry.npmjs.org/${encodeURIComponent(query!)}`).then(res=>res.json())
                if(npm_res.error) null

                const {
                    name,
                    time: {
                        created,
                        modified
                    },
                    maintainers,
                    description,
                    author,
                    license,
                    versions,
                    "dist-tags": dist_tags
                } = npm_res

                const latest = versions[version] || versions[dist_tags.latest]

                const npm_embed = new MessageEmbed()
                    .setAuthor('NPM', 'https://images-ext-2.discordapp.net/external/3Cuh51nny9guvBRgO7FlskPbsaBIoZRbm4toUA9ba7U/https/i.imgur.com/ErKf5Y0.png', 'https://www.npmjs.com')
                    .setTitle(name)
                    .setColor(0xc9343a)
                    .setDescription(description)
                    .addFields([
                        {
                            name: 'Version:',
                            value: latest.version,
                            inline: true
                        },
                        {
                            name: 'License:',
                            value: license || 'Unlicensed',
                            inline: true
                        },
                        {
                            name: 'Author:',
                            value: author.name,
                            inline: true,
                        },
                        {
                            name: 'Creation Date:',
                            value: new Date(created).toLocaleDateString(),
                            inline: true
                        },
                        {
                            name: 'Modification Date:',
                            value: new Date(modified).toLocaleDateString(),
                            inline: true
                        },
                        {
                            name: 'Types:',
                            value: latest.types || 'None',
                            inline: true
                        },
                        {
                            name: 'Dependencies:',
                            value: Object.keys(latest.dependencies || {}).join(', ') || 'None',
                            inline: true
                        },
                        {
                            name: 'Maintainers:',
                            value: maintainers.map(c => c.name).join(', '),
                        }
                    ])

                return npm_embed
}