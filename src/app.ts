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
app.use(passport.initialize())

app.use('/utilisateurs', Utilisateurs)
app.use('/produits', Produits)
app.use('/commandes', Commandes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})