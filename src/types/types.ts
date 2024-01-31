export interface EnvConfig {
    database: string;
    username: string;
    password: string | null | undefined;
    host: string
}

export interface Config {
    [env: string]: EnvConfig
}