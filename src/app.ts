import express, { Request, Response } from 'express'
import Produits  from './routes/produits'
import Utilisateurs  from './routes/utilisateurs'
import Commandes from './routes/commandes'
import passport from './middleware/passport'
import helmet from 'helmet'
import cors from 'cors'

const app = express() 
const port = 3030

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(helmet())

app.use('/utilisateurs', Utilisateurs)
app.use('/produits', Produits)
app.use('/commandes', Commandes)

app.use(passport.initialize())

app.get(
   "/protected",
   passport.authenticate("jwt", { session: false }),
   (req: Request, res: Response) => {
     console.log(req.user)
     res.send("Vous êtes bien connecté !")
   }
)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})