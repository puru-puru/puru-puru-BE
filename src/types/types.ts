export interface EnvConfig {
    database: string;
    username: string;
    password: string | null | undefined;
    host: string
}

export interface Config {
    [env: string]: EnvConfig
}

export interface RefreshRequest {
    body: {
        accessToken: string;
        refreshToken: string;
    }
}