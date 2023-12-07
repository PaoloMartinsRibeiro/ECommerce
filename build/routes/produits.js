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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produit = yield prisma.produit.create({
            data: {
                nom: req.body.nom,
                description: req.body.description,
                prix: req.body.prix
            }
        });
        res.json(produit);
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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produits = yield prisma.produit.findMany();
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
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produit = yield prisma.produit.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(produit);
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
router.put("/:id", authUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produit = yield prisma.produit.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                nom: req.body.nom,
                description: req.body.description,
                prix: req.body.prix
            }
        });
        res.json(produit);
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
router.delete("/:id", authUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const produit = yield prisma.produit.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(produit);
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
