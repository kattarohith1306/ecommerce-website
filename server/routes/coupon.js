const express= require("express");
const router=express.Router();
// middleware
const { authCheck,adminCheck } =require("../middlewares/auth");
// controller
const {
    create, 
    remove, 
    list,
}=require("../controllers/coupon");

//we use post for create,get for read,put for update

router.post("/coupon",authCheck,adminCheck,create);
router.get("/coupons",list);
router.delete("/coupon/:couponId",authCheck,adminCheck,remove);



  module.exports =  router ;