// config.js
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const environment = process.env.NODE_ENV || 'development'
const envFile = `.env.${environment}`
dotenv.config({ path: envFile })

// Convert the import.meta.url to a directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Default Settings
const defaultSetting = {
  port: process.env.PORT || 8002,
  environment,
}

// SSL Configuration
const sslConfig = JSON.parse(process.env.USE_SSL_CERT ?? 'false')
  ? {
    rejectUnauthorized: false,
    cert: fs.readFileSync(
      path.resolve(__dirname, '../pg-ca-certificate.crt'),
      'utf8',
    ),
  }
  : undefined


// PostgresSQL Connection Settings
const dbConfig = {
  client: 'postgresql',
  pool: { min: 0, max: 10 },
  connection: {
    database: process.env.PG_DBNAME,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOSTNAME,
    port: process.env.PG_PORT || 5432,
    ssl: sslConfig,
  },
}

export { defaultSetting, dbConfig }
