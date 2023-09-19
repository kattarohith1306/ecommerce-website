const Product = require("../models/product");
const slugify = require('slugify');
const User = require("../models/user");

exports.create = async (req,res) => {
      try{
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
      }catch(err){
        console.log(err);
       res.status(400).json({
        err:err.message,
       });
      }
};


exports.listAll = async (req,res) => {
  let products = await Product.find({})
  .limit(parseInt(req.params.count))
  .populate('category')
  .populate('subs')
  .sort([["createdAt","desc"]])
   .exec();
  res.json(products);
};


exports.remove = async (req,res) => {
   try{
        let deleted = await Product.findOneAndRemove({
          slug:req.params.slug,
        }).exec();
        res.json(deleted);
   }catch(err){
     console.log(err);
      res.status(400).json({
        err:err.message,
      });
   }
};


exports.read = async (req,res) => {

  const product  = await Product.findOne({slug:req.params.slug})
  .populate('category')
  .populate('subs')
  .exec();

  res.json(product);

};

exports.update = async (req,res) => {
  try{
           if(req.body.title){
            req.body.slug = slugify(req.body.title);
           }

           const updated = await Product.findOneAndUpdate({slug:req.params.slug},req.body,{new:true}).exec();//to send updated product as resonse we use new:true
           res.json(updated);                                                                                          

  }catch(err){
     console.log("PRODUCT UPDATE ERROR ------>", err);
    //  return res.status(400).send('Product update failed');
    res.status(400).json({
      err:err.message,
     });
  }
};

//without pagination
// exports.list = async (req,res) => {
//        try{
//            //sort:createdAt/updatedAt,order:Asce/desc,limit:3
//            const {sort,order,limit} =req.body;
//            const products = await Product.find({})
//            .populate('category')
//            .populate('subs')
//            .sort([[sort,order]])
//            .limit(limit)
//            .exec();

//            res.json(products);
//        }catch(err){
//          console.log(err);
//        }
 
// };


//with pagination
exports.list = async (req,res) => {
  console.table(req.body);
       try{
           //sort:createdAt/updatedAt,order:Asce/desc,limit:3
           const {sort,order,page} =req.body;
           const currentPage = page || 1;
           const perPage=3;//how many you want to display
           
           const products = await Product.find({})
           .skip((currentPage-1)*perPage)
           .populate('category')
           .populate('subs')
           .sort([[sort,order]])
           .limit(perPage)
           .exec();

           res.json(products);
       }catch(err){
         console.log(err);
       }
 
};


exports.productsCount = async (req,res) => {
     let total = await Product.find({}).estimatedDocumentCount().exec();
     res.json(total);
};

exports.productStar = async (req,res) => {

  //find product to update its start rating
  const product = await Product.findById(req.params.productId).exec();
  //user will be available from the middleware where we make authcheck
  const user = await User.findOne({email:req.user.email}).exec();
  //we should be sending start rating from front end to back end in the request body
  const { star } = req.body;

console.log("stars rating",star);
  //we check who is updating
  //we check if loggedin user have already added the rating to this product?
  let existingRatingObject = product.ratings.find((e)=>(e.postedBy.toString() === user._id.toString()));

  //if user havent left rating yet,we push it
  if(existingRatingObject === undefined){
         //we get the product that we want to Update,even though we are getting new rating as product is already present
         //we update the property of ratings in product model
        let ratingAdded = await Product.findByIdAndUpdate(product._id,{
          $push:{ratings : {star,postedBy:user._id}},
        },
        {new:true},
        ).exec();
        console.log("rating Added",ratingAdded);
        res.json(ratingAdded);

  }else{
          //if user already left rating ,we update it
      
     let ratingUpdated = await Product.updateOne({
      ratings:{$elemMatch: existingRatingObject},
    },{$set:{"ratings.$.star":star}},
    {new:true}
    ).exec();
    console.log("Rating Updated",ratingUpdated);
    res.json(ratingUpdated); 
  }
  


};


exports.listRelated = async (req,res)=>{
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category:product.category,
  })
  .limit(3)
  .populate("category")
  .populate("subs")
  .populate("ratings.postedBy")
  .exec();

  res.json(related);

};

const handleQuery = async (req,res,query) => {
    const products = await Product.find({ $text: {$search:query} })
    .populate("category","_id name")
    .populate("subs","_id name")
    .populate("ratings.postedBy","_id name")
    .exec();

    res.json(products);
};

const handlePrice = async (req,res,price) => {
  try{
        let products = await Product.find({
           price:{
            $gte:price[0],
            $lte:price[1]
           }
        }).populate("category","_id name")
        .populate("subs","_id name")
        .populate("ratings.postedBy","_id name")
        .exec();
        res.json(products);
  }catch(err){
      console.log(err);
  }
};

const handleCategory = async (req,res,category) => {
        try{
             let products = await Product.find({category})
             .populate("category","_id name")
             .populate("subs","_id name")
             .populate("ratings.postedBy","_id name")
             .exec();

             res.json(products);

        }catch(err){
             console.log(err);
        }
};


const handleStars = async (req,res,stars) => {
       //generating a new project
        Product.aggregate([
          {
            $project : {
              document:"$$ROOT",
              //title: "$title",
              floorAverage:{
                $floor: { $avg: "$ratings.star" }
              },
            },
          },
          { $match: {floorAverage:stars} }
        ]).limit(12)
        .exec()
        .then(aggregates => {
          Product.find({ _id:aggregates })
          .populate("category","_id name")
          .populate("subs","_id name")
          .populate("ratings.postedBy","_id name")
          .exec()
          .then(products => {
            res.json(products);
          })
          .catch(err=>console.log("PRODUCT AGGREGATE",err));
        })
        .catch(err => console.log("AGGREGATE ERROR",err));
};

const handleSub = async (req,res,sub) => {
  const products = await Product.find({subs:sub})
  .populate("category","_id name")
          .populate("subs","_id name")
          .populate("ratings.postedBy","_id name")
          .exec();

          res.json(products);
};

const handleShipping = async (req,res,shipping) => {
  const products = await Product.find({shipping})
  .populate("category","_id name")
          .populate("subs","_id name")
          .populate("ratings.postedBy","_id name")
          .exec();

          res.json(products);
};

const handleColor = async (req,res,color) => {
  const products = await Product.find({color})
  .populate("category","_id name")
          .populate("subs","_id name")
          .populate("ratings.postedBy","_id name")
          .exec();

          res.json(products);
};

const handleBrand = async (req,res,brand) => {
  const products = await Product.find({brand})
  .populate("category","_id name")
          .populate("subs","_id name")
          .populate("ratings.postedBy","_id name")
          .exec();

          res.json(products);
};
//search/filter
exports.searchFilters = async (req,res) => {

  const {query,price,category,stars,sub,shipping,color,brand} = req.body;//these names should be exactly same in frontend

  if(query){
    console.log('query--->',query);
    //we use this function to handle different types of search queries
    await handleQuery(req,res,query);
  }

  //price [20,200]
  if(price !== undefined){
      console.log('price--->',price);
      await handlePrice(req,res,price);
  }

  if(category){
    console.log("category--->",category);
    await handleCategory(req,res,category);
  }
  
  if(stars){
    console.log("stars--->",stars);
    await handleStars(req,res,stars);
  }

  if(sub){
    console.log("sub category --->",sub);
    await handleSub(req,res,sub);
  }
  
  if(shipping){
    console.log("shipping --->",shipping);
    await handleShipping(req,res,shipping);
  }

  if(color){
    console.log("color --->",color);
    await handleColor(req,res,color);
  }

  if(brand){
    console.log("brand --->",brand);
    await handleBrand(req,res,brand);
  }
};