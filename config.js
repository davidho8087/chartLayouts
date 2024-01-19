import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` })

const defaultSetting = {
  port: process.env.PORT || 8002,
  environment: process.env.NODE_ENV || 'development',
  cacheEnabled: process.env.CACHE_ENABLED === '1',
}

const postgresConnectionSettings = {
  host: process.env.PG_HOSTNAME,
  database: process.env.PG_DBNAME,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
}

if (JSON.parse(process.env.USE_SSL_CERT ?? 'false')) {
  const certificatePath = path.resolve(`${__dirname}/../pg-ca-certificate.crt`)
  postgresConnectionSettings.ssl = {
    rejectUnauthorized: false,
    cert: fs.readFileSync(certificatePath, 'utf8'),
  }
}

export { postgresConnectionSettings, defaultSetting }
