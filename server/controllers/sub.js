
const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");

exports.create = async (req,res) => {
    try{
        
        const {name,parent} = req.body;
        const sub = await new Sub({name,parent,slug:slugify(name)}).save();
        res.json(sub);

    }catch(err){
         console.log("SUB CREATE ERROR ======>",err);
       res.status(400).send("CREATE SUB FAILED");
    }
};

exports.list = async (req,res) => {
    res.json(await Sub.find({}).sort({createdAt:-1}).exec());
};

exports.read = async (req,res) => {
    //slug is used in read route edndpoint so we are grabbing that
    let sub = await Sub.findOne({slug:req.params.slug}).exec();
    let products = await Product.find({subs:sub})//this looks into subs array and look for this particular sub and find products
    .populate("category")
    .exec();

    res.json({sub,products});
};

exports.update = async (req,res) => {
    const {name,parent} = req.body;
    try{
      const updated = await Sub.findOneAndUpdate(
        {slug:req.params.slug},
        {name,parent,slug:slugify(name)},
        {new:true}
        );
        
        res.json(updated);
    }catch(err){
        res.status(400).sent("UPDATE SUB ERROR");
    }
};

exports.remove = async (req,res) => {
    try{
     const deleted = await Sub.findOneAndDelete({slug : req.params.slug}).exec(); 
    res.json(deleted);
    }catch(err){
        res.status(400).sent("REMOVE SUB ERROR");
    }
};

