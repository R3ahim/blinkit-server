import mongoose from "mongoose";



export const connectDB = async(uri)=>{
    try {
        await mongoose.connect(uri)
        console.log("Db is connected Now Hwwo")
    } catch (error) {
        console.log("databse has erro",error)
    }
}