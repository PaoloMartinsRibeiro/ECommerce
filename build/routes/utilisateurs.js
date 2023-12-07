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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authUser_1 = __importDefault(require("../middleware/authUser"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(req.body.motDePasse, saltRounds);
        const utilisateur = yield prisma.utilisateur.create({
            data: {
                email: req.body.email,
                motDePasse: hashedPassword
            }
        });
        res.json(utilisateur);
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
router.post('/signIn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, motDePasse } = req.body;
    try {
        const utilisateur = yield prisma.utilisateur.findUnique({ where: { email } });
        if (utilisateur && bcrypt_1.default.compareSync(motDePasse, utilisateur.motDePasse)) {
            const token = jsonwebtoken_1.default.sign({ userId: utilisateur.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
            res.json({ token });
        }
        else {
            res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Une erreur interne est survenue' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const utilisateurs = yield prisma.utilisateur.findMany();
        res.json(utilisateurs);
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
        const utilisateur = yield prisma.utilisateur.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(utilisateur);
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
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(req.body.motDePasse, saltRounds);
        const utilisateur = yield prisma.utilisateur.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                email: req.body.email,
                motDePasse: hashedPassword
            }
        });
        res.json(utilisateur);
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
router.delete('/:id', authUser_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const utilisateur = yield prisma.utilisateur.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json(utilisateur);
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
