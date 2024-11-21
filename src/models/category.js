import mongoose from "mongoose"

const categoryScehma = new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
});

const Category = mongoose.model("Category",categoryScehma);

export default Category;