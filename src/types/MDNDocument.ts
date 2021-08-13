export interface MDNDocument {
    mdn_url: string;
    score: number;
    title: string;
    locale: string;
    slug: string;
    popularity: number;
    summary: string;
    highlight: { body: string[], title: string[] };
}