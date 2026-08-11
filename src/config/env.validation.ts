import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),

  // External Services
  AUTH_SERVICE_URL: Joi.string().uri().optional(),
  HR_SERVICE_URL: Joi.string().uri().optional(),
  X_API_KEY: Joi.string().optional(),

  // Database
  DATABASE_URL: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().optional().default('default-secret'),
  JWT_PUBLIC_KEY_BASE64: Joi.string().optional(),
  JWT_EXPIRATION: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().optional().default('default-refresh-secret'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),

  // CORS
  CORS_ORIGIN: Joi.string().default('*'),

  // API
  API_PREFIX: Joi.string().default('api'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
  SWAGGER_PATH: Joi.string().default('api-docs'),
});
