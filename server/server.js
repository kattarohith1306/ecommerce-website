
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const morgan=require("morgan");
const cors=require("cors");
const { readdirSync }=require("fs");
require("dotenv").config();


//app
const app=express();

//db             process.env.DATABASE
mongoose.connect("mongodb+srv://kattarohith:13062000@cluster0.hku3dcr.mongodb.net/ecom-udemy",{
    useNewUrlParser:true,
})
    .then(()=>console.log("DB connected"))
    .catch((err)=>console.log("DB connection error",err));
  
//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({limit:"2mb"}));//if the client is sending data bigger than 2mb we get an error
app.use(cors());

// routes middleware
readdirSync("./routes").map((r)=>(app.use("/api",require("./routes/"+r))));


// port
const port=process.env.PORT||8000; 
app.listen(port,()=>console.log(`server is running on port ${port}`));