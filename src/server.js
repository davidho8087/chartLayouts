// server.js
import express from 'express'
import cors from 'cors'
import router from './router.js'
import logger from './lib/logger.js'


const app = express()

app.use(cors())
// app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
  res.send('This is AI app service')
  // setTimeout(() => {
  //   next(new Error('hello error here'))
  // }, 1)
})

app.use('/api', router)

app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.json({ message: `had an error: ${err.message}` })
})

export default app
