const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");
//when user clicks proceed to checkout user's cart is stores in database after executing the code below
exports.userCart = async (req,res) => {
          const {cart} = req.body;

          let products = [];

          const user = await User.findOne({email:req.user.email}).exec();

          //check if cart with logged in user already exist
          let cartExistByThisUser = await Cart.findOne({orderedBy:user._id}).exec();

          if(cartExistByThisUser){
            //remove() function is depricate use deleteOne() instead
            cartExistByThisUser.deleteOne();
            console.log("remove old cart");
          }

          for(let i=0; i < cart.length; ++i){
                    let object = {};

                    object.product = cart[i]._id;
                    object.count = cart[i].count;
                    object.color = cart[i].color;
                    //get price to create total in object
                    //we are getting price manually from backend ,we cant depend on price from front end because people
                    //can change price in front end manually
                    let {price} = await Product.findById(cart[i]._id).select('price').exec();
                    object.price = price;
                    products.push(object);
          }

          let cartTotal = 0;
          for(let i = 0; i < products.length; ++i){
            cartTotal = cartTotal + products[i].price * products[i].count ;
          }

          let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy:user._id,
          }).save();

          console.log("new cart --->",newCart);
          res.json({ ok:true });
};

exports.getUserCart = async (req, res) => {
       const user = await User.findOne({email:req.user.email}).exec();

       let cart =  await Cart.findOne({orderedBy:user._id})
       .populate("products.product" , "_id price title totalAfterDiscount")
       .exec();
        
       //why am i getting error like "products" is null cannot be destructures
       //because after deleting the cart we are accessing the cart which is null so we cant destructure it
       if(cart){
       const {products,cartTotal,totalAfterDiscount } = cart; 
       res.json({products,cartTotal,totalAfterDiscount });
      }
       
};

exports.emptyCart = async (req,res) => {
        
         const user = await User.findOne({email:req.user.email}).exec();

         const cart =  await Cart.findOneAndRemove({orderedBy:user._id}).exec();

         res.json(cart);
}; 

exports.saveAddress = async (req,res) => {
  const userAddress = await User.findOneAndUpdate({email:req.user.email},{address:req.body.address}).exec();

  res.json({ok:true});
};

exports.applyCouponToUserCart = async (req,res) => {
  
  const {coupon} = req.body;
  console.log("COUPON",coupon);
  const validCoupon = await Coupon.findOne({name:coupon}).exec();
  if(validCoupon === null){
    return res.json({
      err:"Invalid Coupon",
    });
  }
console.log("VALID COUPON",validCoupon);
const user = await User.findOne({email:req.user.email}).exec();
 
let {products,cartTotal} = await Cart.findOne({orderedBy:user._id}).populate("products.product","_id title price").exec();

console.log("CART TOTAL",cartTotal,"discount",validCoupon.discount);

  //calculate the total after discount
   
    let totalAfterDiscount = (cartTotal - ((cartTotal * validCoupon.discount)/100)).toFixed(2);

    Cart.findOneAndUpdate({orderedBy:user._id},{totalAfterDiscount},{new:true}).exec();

    res.json(totalAfterDiscount);

};

exports.createOrder = async (req,res) => {
  //we will send this stripeResponse from frontend
   const {paymentIntent} = req.body.stripeResponse;
   const user = await User.findOne({email:req.user.email}).exec();

   const {products} = await Cart.findOne({orderedBy:user._id}).exec();

   let newOrder = await new Order({
     products,
     paymentIntent,
     orderedBy:user._id,//i was not able to identify error untill is saw that O is capital as o is small in model for orderedBy
   }).save();

   //decrement quantity and increment sold
   let bulkOptions = products.map((item)=>{
           return {
            updateOne:{
              filter:{_id:item.product._id},
              update:{$inc:{quantity:-item.count, sold:+item.count}},
            },
           }
   });

   const updated = await Product.bulkWrite(bulkOptions,{});
   console.log("quantity--,sold+++",updated);
  
   console.log("New order saved",newOrder);
   res.json({ok:true});
};

exports.orders = async (req,res) => {
    let user = await User.findOne({email:req.user.email}).exec();

    let userOrder = await Order.find({orderedBy:user._id}).populate("products.product").exec();
    res.json(userOrder);
};


exports.addToWishlist = async (req,res) => {
 const {productId} = req.body;
 const user  = await User.findOneAndUpdate({email:req.user.email},{$addToSet: { wishlist:productId }}).exec();

 res.json({ok:true});
};

exports.wishlist = async (req,res) => {
    const list = await User.findOne({email:req.user.email}).select("wishlist").populate("wishlist").exec();
    res.json(list);
};

exports.removeFromWishlist = async (req,res) => {
     const {productId} = req.params;
     const user = await User.findOneAndUpdate({email:req.user.email},{$pull:{wishlist:productId}}).exec();

     res.json({ok:true});
};


exports.createCashOrder = async (req,res) => {
  
   const {COD,couponApplied } = req.body;
  
   if(!COD)return res.status(400).send("Create cash order failed");
   //if COD is true create order with status of cash on delivery

   const user = await User.findOne({email:req.user.email}).exec();

   const userCart = await Cart.findOne({orderedBy:user._id}).exec();
   
   let finalAmount = 0;

   if(couponApplied && userCart.totalAfterDiscount) {
       finalAmount = userCart.totalAfterDiscount*100;//even in console it shows 400000 for 4000rs because in console we are showing paisa
       //but in admin dashboard it is converted to rupees
   }else{
       finalAmount = userCart.cartTotal*100;
   }      

   let newOrder = await new Order({
     products:userCart.products,
     paymentIntent:{
      
        id:uniqueid(),
        amount:finalAmount,
        currency:"inr",
        status:"Cash On Delivery",
        created: Date.now(),
        payment_method_types:["cash"],
     },
     orderedBy:user._id,//i was not able to identify error untill is saw that O is capital as o is small in model for orderedBy
     orderStatus:"Cash On Delivery",
   }).save();

   //decrement quantity and increment sold
   let bulkOptions = userCart.products.map((item)=>{
           return {
            updateOne:{
              filter:{_id:item.product._id},
              update:{$inc:{quantity:-item.count, sold:+item.count}},
            },
           }
   });

   const updated = await Product.bulkWrite(bulkOptions,{});
   console.log("quantity--,sold+++",updated);
  
   console.log("New order saved",newOrder);
   res.json({ok:true});
};