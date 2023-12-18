import express, { Request, Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import authenticateUser from "../middleware/authUser"

const prisma = new PrismaClient()
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.motDePasse, saltRounds)

        const utilisateur = await prisma.utilisateur.create({
            data: {
                email: req.body.email,
                motDePasse: hashedPassword
            }
        })
        res.json(utilisateur)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.post('/signIn', async (req: Request, res: Response) => {
    const { email, motDePasse } = req.body

    try {
        const utilisateur = await prisma.utilisateur.findUnique({ where: { email } })

        if (utilisateur && bcrypt.compareSync(motDePasse, utilisateur.motDePasse)) {
            const token = jwt.sign(
                { userId: utilisateur.id },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '1h' }
            )

            res.json({ token })
        } else {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' })
        }
    } catch (error) {
        res.status(500).json({ error: 'Une erreur interne est survenue' })
    }
})

router.get('/', authenticateUser, async (req, res) => {
    try {
        const utilisateurs = await prisma.utilisateur.findMany()
        res.json(utilisateurs)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.get('/:id', authenticateUser, async (req, res) => {
    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(utilisateur)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.put('/:id', authenticateUser, async (req, res) => {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.motDePasse, saltRounds)

        const utilisateur = await prisma.utilisateur.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                email: req.body.email,
                motDePasse: hashedPassword
            }
        })
        res.json(utilisateur)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.delete('/:id', authenticateUser, async (req, res) => {
    const userId = Number(req.params.id)

    try {
        await prisma.$transaction(async (prisma) => {
            await prisma.commandeProduit.deleteMany({
                where: {
                    commande: {
                        utilisateurId: userId
                    }
                }
            })

            await prisma.commande.deleteMany({
                where: { utilisateurId: userId }
            })

            const utilisateur = await prisma.utilisateur.delete({
                where: { id: userId }
            })

            res.json(utilisateur)
        })
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})



export default router