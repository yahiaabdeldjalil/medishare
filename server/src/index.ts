import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import donationRoutes from './routes/donations'
import needRoutes from './routes/needs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'ok', message: 'MediShare API running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/needs', needRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})