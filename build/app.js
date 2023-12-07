"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produits_1 = __importDefault(require("./routes/produits"));
const utilisateurs_1 = __importDefault(require("./routes/utilisateurs"));
const commandes_1 = __importDefault(require("./routes/commandes"));
const passport_1 = __importDefault(require("./middleware/passport"));
const app = (0, express_1.default)();
const port = 3030;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/utilisateurs', utilisateurs_1.default);
app.use('/produits', produits_1.default);
app.use('/commandes', commandes_1.default);
app.use(passport_1.default.initialize());
app.get("/protected", passport_1.default.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req.user);
    res.send("Vous êtes bien connecté !");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
