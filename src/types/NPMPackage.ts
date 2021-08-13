interface StringIndex<T> {
    [key: string]: T
}

interface NPMPackage1 {
    name: string;
    time: { 
        modified: string,
        created: string
    };
    maintainers: { name: string, email: string }[];
    description: string;
    author: { 
        name: string, email: string 
    };
    license?: string;
    versions: StringIndex<{ version: string, types?: string, dependencies?: string[] }>;
    'dist-tags': {
        latest: string;
    }
}

interface NPMPackage2 {
    error: object;
}

export type NPMPackage = NPMPackage1 & NPMPackage2