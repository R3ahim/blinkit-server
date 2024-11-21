import { Customer,DeliveryPartner } from "../../../models/index.js";

export const updateUser = async (req,reply) =>{
    try{
        const {userId} = req.user;
        const updateData = req.body;

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);

        if(!user){
            return reply.status(404).send({message:"user Not Found"});

        }
        let userModel;
        if(user.role === "Customer"){
            userModel = Customer;

        }
        else if(user.role === "DeliveryPartner"){
            userModel = DeliveryPartner;
        }
        else{
            return reply.status(404).send({message:"invalid user role"});

        }


        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new:true,runValidators:true}
        );

        if(!updatedUser){
            return reply.status(404).send({message:"user Not Found"});

        }
        return reply.send({
            message:"user updated Successfully"
        });
    }
    catch(error){
        return reply.status(500).send({message:'faild to update user',error})

    }
}