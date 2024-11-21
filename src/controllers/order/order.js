import  {Customer, DeliveryPartner}  from "../../models/user.js";
import Branch from "../../models/branch.js";
import Order from "../../models/order.js";
    
    



export const createOrder = async(req,res)=>{
    try {
        const  {userId} = req.user;
        const {items,branch,totalPrice} = req.body;

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch);
        

        if(!customerData){
            return res.status(404).send({message:"Customer not Found"})

        }


        const newOrder = new Order({
            customer:userId,
            items:items.map((item)=>({
                id:item.id,
                item:item.item,
                count:item.count
            })),
            branch,
            totalPrice,
            deliveryLocation:{
                latitude:customerData.liveLocation.latitude,
                logitude:customerData.liveLocation.longitude,
                address:customerData.address || "No Address available"
            },
            pickupLocation:{
                latitude:branchData.location.latitude,
                logitude:branchData.location.longitude,
                address:branchData.address || "No Address available"
            },
        })

        const saveOrder = await newOrder.save();
        return res.status(201).send(saveOrder)
    } catch (error) {
        return res.status(500).send({message:"faild to create order",error})
    }
}


export const confirmOrder = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const {userId} = req.user;
        const {deliveryPersonLocation} = req.body;

        const deliveryPerson = await DeliveryPartner.findById(userId)
        if(!deliveryPerson){
            return res.status(404).send({message:"Delivery Person not Found"})
        }

        const order = await Order.findById(orderId)
        if(!order) return res.status(404).send({message:'order not found'})

        if(order.status !== 'available'){
          return res.status(400).send({message:"Order is not avaible"})
        }
        order.status = 'confirmed'
        order.deliveryPartner= userId;
        order.deliveryPersonLocation={
            latitude:deliveryPersonLocation?.latitude,
            longitude:deliveryPersonLocation?.latitude,
            address:deliveryPersonLocation?.address || ""
        }
        req.server.io.to(orderId).emit("orderConfirmed",order)
    
        await order.save();
        return res.send(order)
    } catch (error) {
        return res.status(500).send({message:"Failed to confirm Order"},error)
    }
}


export const updateOrderStatus = async(req,res)=>{
    try {
        const {orderId} = req.params
        const {status,deliveryPersonLocation} = req.body;
        const {userId} = req.user;
        const deliveryPerson = await DeliveryPartner.findById(userId)
       if(!deliveryPerson){
        return res.status(404).send({message:"Delivery person not Found",error})
       }
        
       const order = await Order.findById(orderId)
       if(!order) return res.status(404).send({message:'order not found'})

       if(['cencelled','delivered'].includes(order.status)){
         return res.status(400).send({message:"Order can't be update"})
       }
       if(order.deliveryPartner.toString() !== userId){
        return res.status(403).send({message:"Unauthorized"})
      }
       order.status = status;
       order.deliveryPartner= userId;
       order.deliveryPersonLocation=deliveryPersonLocation;
       await order.save();

       req.server.io.to(orderId).emit("LiveTrackingUpdates",order)

       return res.send(order)
    } catch (error) {
        return res.status(500).send({message:"faild to update status",error})
 
    }
}

export const getOrders = async(req,res)=>{
    try {
        const {status,customerId,deliveryPartnerId,branchId} = req.query;
        let query={}
        if(status){
            query.status = status;
        } 
        if(customerId){
            query.customer = customerId;
        }
        if(deliveryPartnerId){
            query.deliveryPartner = deliveryPartnerId;
            query.branch = branchId;

        }
        
        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
        return res.send(orders)
        
    } catch (error) {
        return res.status(500).send({message:"faild to create order",error})

    }
}

export const getOrderById = async(req,res)=>{
    try {
        const {orderId} = req.query;
     
        
      
        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner"
        )

        if(!order){
            return res.status(404).send({message:"order is not Found"})
        }
        return res.send(order)
    } catch (error) {
        return res.status(500).send({message:"faild to create order",error})

    }
}



// 224