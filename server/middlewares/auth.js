const admin=require("../firebase/index");
const User = require("../models/user");//we require user model which contains all that data
//next is call back function
//1st layer of security 
exports.authCheck= async (req,res,next) => {
    // console.log(req.headers); // token
    try{
     const firebaseUser= await admin.auth().verifyIdToken(req.headers.authtoken);
    //  console.log("firebase user in auth check",firebaseUser);
     req.user = firebaseUser;
     next();
    }catch(err){
     
      res.status(401).json({
        err:"Invalid or expired token",
      })
    }
};

//we will apply authCheck middleware first before this so we will get access of user in req
exports.adminCheck = async (req,res,next)=>{
     const { email } = req.user;
     const adminUser = await User.findOne({email}).exec();
        
     //403 is unauthorised access
     if(adminUser.role !== "admin"){
      res.status(403).json({
        err:"Admin resource.access denied",
     });
     }else{
      next();
     }
};