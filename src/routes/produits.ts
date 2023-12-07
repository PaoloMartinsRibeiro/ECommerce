import express from "express"
import { PrismaClient } from "@prisma/client"
import authenticateUser from "../middleware/authUser"

const prisma = new PrismaClient()
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const produit = await prisma.produit.create({
            data: {
                nom: req.body.nom,
                description: req.body.description,
                prix: req.body.prix
            }
        })
        res.json(produit)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})


router.get("/", async (req, res) => {
    try {
        const produits = await prisma.produit.findMany()
        res.json(produits)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.get("/:id", async (req, res) => {
    try {
        const produit = await prisma.produit.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(produit)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const produit = await prisma.produit.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                nom: req.body.nom,
                description: req.body.description,
                prix: req.body.prix
            }
        })
        res.json(produit)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const produit = await prisma.produit.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(produit)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

export default router