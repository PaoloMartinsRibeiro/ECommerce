import express, { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({ error: "Unauthorized - Missing token" })
    }

    jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" })
        }
        (req as any).user = decoded
        next()
    })
}

export default authenticateUser