import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read OpenAPI spec
const openApiSpec = parse(
  readFileSync(join(__dirname, '../../openapi.yaml'), 'utf8')
);

export const swaggerOptions = {
  swaggerOptions: {
    url: '/api-docs/swagger.json',
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

export const swaggerSpec = openApiSpec;

export { swaggerUi };
