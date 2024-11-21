import {  Customer,DeliveryPartner } from "../../models/user.js";
import 'dotenv/config'

import jwt  from "jsonwebtoken";


const generateTokens = (user) =>{
    const accessToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    const refreshToken = jwt.sign(
        {userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    return{accessToken,refreshToken}
}


export const loginCustomer = async(req,reply)=>{
    try {
        const {phone} = req.body;
        let customer = await Customer.findOne({phone});
        

        if(!customer){
            customer = new Customer({
                phone,
                role:"Customer",
                isActivated:true,
            });

            await customer.save;
          
        }
        const {accessToken,refreshToken} = generateTokens(customer);
        return reply.send({
            message:customer?"Login SuccessFull":"customer Created SuccessFull and logged",
            accessToken,
            refreshToken,
            customer

        })
        
    } catch (error) {
       return reply.status(500).send({message:"An Error Occured",error})        
    }
}
export const loginDeliveryPartner = async(req,reply)=>{
    try {
        const {email,password} = req.body;
        const deliveryPartner = await DeliveryPartner.findOne({email});
        

        if(!deliveryPartner){
            return reply.status(404).send({message:"Delivery Partner Not Fount",error})        

        }
        const isMatch = password === deliveryPartner.password;
        if(!isMatch){
            return reply.status(404).send({message:"invalid credenttials",error})        

        }
        const {accessToken,refreshToken} = generateTokens(deliveryPartner);
        return reply.send({
            message:"Login SuccessFull",
            accessToken,
            refreshToken,
            deliveryPartner

        })
        
    } catch (error) {
       return reply.status(500).send({message:"An Error Occured",error})        
    }
}





export const refreshToken = async (req,reply)=>{
    const {refreshToken} = req.body;

    if(!refreshToken){
        return reply.status(401).send({message:"An Error Occured"})        
 
    }

    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        let user;
        if(decoded.role==="Customer"){
            user = await Customer.findById(decoded.userId);

        }
        else{
            return reply.status(403).send({message:"invalid Role and token"})
        }

        if(!user){
            return reply.status(403).send({message:'invalid refresh token'})
        }

        const {accessToken,refreshToken:newRefreshToken} = generateTokens(user);
        
        return reply.send({
            message:'token Refresh',
            accessToken,
            refreshToken:newRefreshToken,

        })
    } catch (error) {
        return reply.status(401).send({message:"Invalid Refresh Token"})    
        
    }
}


export const fetchUser = async(req,reply)=>{
    // something is problem here
    try {
        const {userId,role} = req.user;
        let user;
        if(role==="Customer"){
            user = await Customer.findById(userId);

        }
        else{
            return reply.status(403).send({message:"invalid Role and token"})
        }   
        
        if(!user){
            return reply.status(403).send({message:'User Not Found'});
        }

        return reply.send({
            message:"user get Successfully",
            user,
        })
    } catch (error) {
        return reply.status(500).send({message:"an error occur",error})
        
    }
}