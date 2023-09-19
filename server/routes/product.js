const express= require("express");
const router=express.Router();
// middleware
const { authCheck,adminCheck } =require("../middlewares/auth");
// controller
const {
    create, 
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters
}=require("../controllers/product");

//we use post for create,get for read,put for update

router.post("/product",authCheck,adminCheck,create);
router.get("/products/total",productsCount);//when this is placed here this is working


router.get("/products/:count",listAll);//public api endpoint so no need of middlewares even no need of users authentication 

router.delete("/product/:slug",authCheck,adminCheck,remove);
router.get("/product/:slug",read);
router.put("/product/:slug",authCheck,adminCheck,update);
router.post("/products",list);
// router.get("/products/total",productsCount);//when products/total is kept here iam getting all documents not number

//rating endpoint,put method is used as we are updating the product
router.put("/product/star/:productId",authCheck,productStar);

//related
router.get("/product/related/:productId",listRelated);
//search
router.post("/search/filters",searchFilters);

  module.exports =  router ;