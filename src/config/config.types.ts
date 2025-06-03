export interface ServerConfig {
    port: number;
    host: string;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface EnvConfig {
    name: string;
}

export interface AppConfig {
    server: ServerConfig;
    database: DatabaseConfig;
    env: EnvConfig;
    // Agrega aquí más secciones de configuración según necesites
}

// Tipo para las claves de configuración (versión simplificada)
export type ConfigKey = keyof AppConfig | `server.${keyof ServerConfig}` | `database.${keyof DatabaseConfig}` | `env.${keyof EnvConfig}`;

// Tipo para obtener el tipo de una clave de configuración
export type ConfigValue<T extends ConfigKey> = T extends keyof AppConfig
    ? AppConfig[T]
    : T extends `server.${infer K}`
      ? K extends keyof ServerConfig
          ? ServerConfig[K]
          : never
      : T extends `database.${infer K}`
        ? K extends keyof DatabaseConfig
            ? DatabaseConfig[K]
            : never
        : T extends `env.${infer K}`
          ? K extends keyof EnvConfig
              ? EnvConfig[K]
              : never
          : never;
