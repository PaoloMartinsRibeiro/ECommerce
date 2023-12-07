"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const authUser_1 = __importDefault(require("../middleware/authUser"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { utilisateurId, produits } = req.body;
        const nouvelleCommande = yield prisma.commande.create({
            data: {
                utilisateurId: utilisateurId,
                commandeItems: {
                    create: produits.map((p) => ({
                        produitId: p.id,
                        quantite: p.quantite
                    })),
                },
            },
        });
        res.json(nouvelleCommande);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
// SYNTAXE INSERTION
// {
//     "utilisateurId": 1,
//     "produits": [
//         { "id": 1, "quantite": 2 }
//     ]
// }
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandes = yield prisma.commande.findMany();
        res.json(commandes);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commande = yield prisma.commande.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(commande);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
router.get('/:id/produits', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produits = yield prisma.commandeProduit.findMany({
            where: {
                commandeId: Number(req.params.id)
            },
            include: {
                produit: true
            }
        });
        res.json(produits);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
router.put('/:id', authUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { produits } = req.body;
        const commande = yield prisma.commande.update({
            where: { id: Number(req.params.id) },
            data: {
                utilisateurId: req.body.utilisateurId,
                commandeItems: {
                    deleteMany: {},
                    create: produits.map((p) => ({
                        produitId: p.id,
                        quantite: p.quantite,
                    })),
                },
            },
        });
        res.json(commande);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
// SYNTAXE MODIFICATION
// {
//     "utilisateurId": 1,
//     "produits": [
//         { "id": 1, "quantite": 10 }
//     ]
// }
router.delete('/:id', authUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandeId = Number(req.params.id);
        yield prisma.commandeProduit.deleteMany({
            where: { commandeId: commandeId }
        });
        const commande = yield prisma.commande.delete({
            where: { id: commandeId }
        });
        res.json(commande);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        }
        else {
            res.status(500).json({ error: "Une erreur inconnue est survenue" });
        }
    }
}));
exports.default = router;
