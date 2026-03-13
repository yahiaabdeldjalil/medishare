import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', async (req: any, res: any) => {
    try {
        const { search } = req.query

        const donations = await prisma.donation.findMany({
            where: {
                status: 'AVAILABLE',
                ...(search && {
                    medName: { contains: search as string, mode: 'insensitive' },
                }),
            },
            include: {
                donor: { select: { id: true, name: true, location: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        res.json(donations)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})
router.post('/', authenticate, async (req: any, res: any) => {
    const { medName, quantity, expiryDate, condition, location, photoUrl } = req.body

    if (!medName || !quantity || !expiryDate || !location) {
        res.status(400).json({ error: 'medName, quantity, expiryDate and location are required' })
        return
    }

    try {
        const donation = await prisma.donation.create({
            data: {
                donorId: req.userId!,
                medName,
                quantity,
                expiryDate: new Date(expiryDate),
                condition: condition || 'SEALED',
                location,
                photoUrl: photoUrl || null,
            },
        })

        res.status(201).json(donation)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})
router.get('/:id', async (req: any, res: any) => {
    try {
        const donation = await prisma.donation.findUnique({
            where: { id: req.params.id as string },
            include: {
                donor: { select: { id: true, name: true, location: true } },
            },
        })

        if (!donation) {
            res.status(404).json({ error: 'Donation not found' })
            return
        }

        res.json(donation)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})
router.patch('/:id/status', authenticate, async (req: any, res: any) => {
    const { status } = req.body
    const validStatuses = ['AVAILABLE', 'RESERVED', 'GIVEN']

    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' })
        return
    }

    try {
        const donation = await prisma.donation.findUnique({
            where: { id: req.params.id as string },
        })

        if (!donation) {
            res.status(404).json({ error: 'Donation not found' })
            return
        }

        if (donation.donorId !== req.userId) {
            res.status(403).json({ error: 'Not your donation' })
            return
        }

        const updated = await prisma.donation.update({
            where: { id: req.params.id as string },
            data: { status },
        })

        res.json(updated)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

export default router