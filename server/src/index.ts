import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import donationRoutes from './routes/donations'
import needRoutes from './routes/needs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://medishare-app.onrender.com',
  ],
  credentials: true,
}))
app.use(express.json())

app.get('/health', (_: any, res: any) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/needs', needRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})