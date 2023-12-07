import express from "express"
import { PrismaClient } from "@prisma/client"
import { ProduitCommande } from "../types/ProduitCommande"
import authenticateUser from "../middleware/authUser"

const prisma = new PrismaClient()
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { utilisateurId, produits } = req.body

        const nouvelleCommande = await prisma.commande.create({
            data: {
                utilisateurId: utilisateurId,
                commandeItems: {
                    create: produits.map((p: ProduitCommande) => ({
                        produitId: p.id,
                        quantite: p.quantite
                    })),
                },
            },
        })

        res.json(nouvelleCommande)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

// SYNTAXE INSERTION
// {
//     "utilisateurId": 1,
//     "produits": [
//         { "id": 1, "quantite": 2 }
//     ]
// }

router.get('/', async (req, res) => {
    try {
        const commandes = await prisma.commande.findMany()
        res.json(commandes)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
}})

router.get('/:id', async (req, res) => {
    try {
        const commande = await prisma.commande.findUnique({
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(commande)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

router.get('/:id/produits', async (req, res) => {
    try {
        const produits = await prisma.commandeProduit.findMany({
            where: {
                commandeId: Number(req.params.id)
            },
            include: {
                produit: true
            }
        })
        res.json(produits)
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
        const { produits } = req.body

        const commande = await prisma.commande.update({
            where: { id: Number(req.params.id) },
            data: {
                utilisateurId: req.body.utilisateurId,
                commandeItems: {
                    deleteMany: {},
                    create: produits.map((p: ProduitCommande) => ({
                        produitId: p.id,
                        quantite: p.quantite,
                    })),
                },
            },
        })
        res.json(commande)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})

// SYNTAXE MODIFICATION
// {
//     "utilisateurId": 1,
//     "produits": [
//         { "id": 1, "quantite": 10 }
//     ]
// }

router.delete('/:id', authenticateUser, async (req, res) => {
    try {
        const commandeId = Number(req.params.id)

        await prisma.commandeProduit.deleteMany({
            where: { commandeId: commandeId }
        })

        const commande = await prisma.commande.delete({
            where: { id: commandeId }
        })

        res.json(commande)
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message })
        } else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" })
        }
    }
})


export default router