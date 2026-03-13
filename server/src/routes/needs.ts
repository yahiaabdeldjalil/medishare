import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', async (req: any, res: any) => {
    try {
        const { search } = req.query

        const needs = await prisma.need.findMany({
            where: {
                status: 'OPEN',
                ...(search && {
                    medName: { contains: search as string, mode: 'insensitive' },
                }),
            },
            include: {
                seeker: { select: { id: true, name: true, location: true } },
            },
            orderBy: [
                { urgency: 'desc' },
                { createdAt: 'desc' },
            ],
        })

        res.json(needs)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

router.post('/', authenticate, async (req: any, res: any) => {
    const { medName, quantityNeeded, urgency, description } = req.body

    if (!medName || !quantityNeeded) {
        res.status(400).json({ error: 'medName and quantityNeeded are required' })
        return
    }

    try {
        // Create the need
        const need = await prisma.need.create({
            data: {
                seekerId: req.userId!,
                medName,
                quantityNeeded,
                urgency: urgency || 'MEDIUM',
                description: description || null,
            },
        })

        // Auto-match: find available donations with same med name
        const matches = await prisma.donation.findMany({
            where: {
                status: 'AVAILABLE',
                medName: { contains: medName, mode: 'insensitive' },
            },
            include: {
                donor: { select: { id: true, name: true } },
            },
        })

        res.status(201).json({ need, matches })
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})
router.get('/:id', async (req: any, res: any) => {
    try {
        const need = await prisma.need.findUnique({
            where: { id: req.params.id as string },
            include: {
                seeker: { select: { id: true, name: true, location: true } },
            },
        })

        if (!need) {
            res.status(404).json({ error: 'Need not found' })
            return
        }

        res.json(need)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }
})

router.patch('/:id/status', authenticate, async (req: any, res: any) => {
    const { status } = req.body
    const validStatuses = ['OPEN', 'MATCHED', 'FULFILLED']

    if (!validStatuses.includes(status)) {
        res.status(400).json({ error: 'Invalid status' })
        return
    }

    try {
        const need = await prisma.need.findUnique({
            where: { id: req.params.id as string },
        })

        if (!need) {
            res.status(404).json({ error: 'Need not found' })
            return
        }

        if (need.seekerId !== req.userId) {
            res.status(403).json({ error: 'Not your need' })
            return
        }

        const updated = await prisma.need.update({
            where: { id: req.params.id as string },
            data: { status },
        })

        res.json(updated)
    } catch {
        res.status(500).json({ error: 'Server error' })
    }

})

export default router