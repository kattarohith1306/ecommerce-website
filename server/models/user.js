const mongoose=require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema=new mongoose.Schema({
        name:String,
        email:{
            type:String,
            required:true,
            index:true,
        },
        role:{
            type:String,
            default:"subscirber",
        },
        cart:{
            type:Array,
            default:[],
        },
        address:String,
        wishlist:[{type:ObjectId,ref:"Product"}],
},
{ timestamps:true }
);

module.exports = mongoose.model("User",userSchema);