import express from 'express'
import cors from 'cors'
import reportRoutes from './routes/report.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', reportRoutes)

export default app