import 'dotenv/config';
import * as Joi from 'joi';

interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
}

const envSchema: Joi.ObjectSchema<EnvConfig> = Joi.object({
    PORT: Joi.number().default(3001),
    DATABASE_URL: Joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const envConfig: EnvConfig = {
    PORT: value.PORT,
    DATABASE_URL: value.DATABASE_URL,
};

export const envs = {
    port: envConfig.PORT,
    databaseUrl: value.DATABASE_URL,
};