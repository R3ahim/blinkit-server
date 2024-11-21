import Product  from "../../models/products.js";


export const getProductsByCategoryId = async(req,reply)=>{
const {categoryId} = req.params;
    try {
        const product = await Product.find({category:categoryId})
        .select("-category")
        .exec();
        return reply.send(product);
    } catch (error) {
        return reply.status(500).send({message:"an error occurred",error})
        
    }

}


// 2:16/ videos