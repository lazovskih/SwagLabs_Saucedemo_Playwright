import dotenv from "dotenv";
import path from "path";

// Ensure .env is loaded before reading process.env
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

const REQUIRED_ENV_VARS = [
    "STANDARD_USER",
    "LOCKED_OUT_USER",
    "DEMO_PASSWORD",
    "URL",
] as const;

type RequiredEnvKey = (typeof REQUIRED_ENV_VARS)[number];

export interface EnvConfig {
    readonly standardUser: string;
    readonly lockedOutUser: string;
    readonly demoPassword: string;
    readonly baseUrl: string;
}

function loadEnvConfig(): EnvConfig {
    const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());

    if (missingVars.length > 0) {
        throw new Error(
            `[Environment Config Error]: Missing required environment variable(s): ${missingVars.join(", ")}.\n` +
            `Please ensure they are defined in your .env file or CI environment secrets.`,
        );
    }

    const getEnv = (key: RequiredEnvKey): string => process.env[key]!.trim();

    return Object.freeze({
        standardUser: getEnv("STANDARD_USER"),
        lockedOutUser: getEnv("LOCKED_OUT_USER"),
        demoPassword: getEnv("DEMO_PASSWORD"),
        baseUrl: getEnv("URL"),
    });
}

export const env: EnvConfig = loadEnvConfig();