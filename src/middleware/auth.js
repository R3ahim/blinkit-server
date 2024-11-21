import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const verifyToken = async(req,reply)=>{
    try {
        const authHeader = req.headers["authorization"]
        
        if(!authHeader || !authHeader.startWith("Bearer ")){
            return reply.status(401).send({message:"Access Token required"})

        }

        const token  = authHeader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded;
        return true;
        
    } catch (error) {
        return reply.status(403).send({message:"invalid or expired token"})
        
    }

}