const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req,res) => {

    const {couponApplied} = req.body;

    const user = await User.findOne({email:req.user.email}).exec();
    

    const cart = await Cart.findOne({orderedBy:user._id}).exec();
  
    if(cart){
        const { cartTotal,totalAfterDiscount } = cart;
        let finalAmount = 0;

    if(couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount*100;
    }else{
        finalAmount = cartTotal*100;
    }
 
    const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmount,
        currency: "inr",
    });
   
    console.log("My SECRET",paymentIntent.client_secret);
    console.log("CART TOTAL CHARGED",cartTotal,"After Discount",totalAfterDiscount);


    res.send({
        clientSecret:paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable:finalAmount,
    });

 }

    
};