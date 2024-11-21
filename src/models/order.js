import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
   orderId:{
    type:String,
    unique:true,

   },
   Customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Customer",
    required:true,

   },
   deliveryPartner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"DeliveryPartner",
    required:true,
   },
   branch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Branch",
    required:true,
   },
   items:[
    {
        id:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Product",
     required:true
 
        },
        items:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Product",
     required:true
 
        },
        count:{type:Number,required:true}
    }
   ],
   deliveryLocation:{
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    address:{type:String},
   },
   pickupLocation:{
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    address:{type:String},
   },
   deliveryPersonLocation:{
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    address:{type:String},
   },
   status:{
    type:String,
    enum:["available","confirmed","arriving","delivered","cancelled"],
    default:"available",
   },
   totalPrice:{type:Number,required:true},
   createAt:{type:Date,default:Date.now},
   updateAt:{type:Date,default:Date.now},
});



async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        {name:sequenceName},
        {$inc:{sequence_value:1}},
        {new: true,upsert:true}
    );
    return sequenceDocument;
}


orderSchema.pre("save",async function (next){
    if(this.isNew){
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORDR${sequenceValue.toString().padStart(5,"0")}`;

    }
    next();
})

const Order = mongoose.model("Order",orderSchema);
export default Order;
