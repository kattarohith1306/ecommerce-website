const User=require("../models/user");
exports.createOrUpdateUser = async (req,res) => {
    const {email,name,picture}=req.user;

    const u=await User.findOneAndUpdate({email},{name:email.split("@")[0],picture},{new:true});//new returns updated user information other it sends old also

    if(u){
      console.log("User updated",u);
      res.json(u);
    }else {
      const newUser=await new User({
        email,
        name:email.split('@')[0],
        picture,
      }).save();
      console.log("User created",newUser);
      res.json(newUser);
    }
  };

  //here we are getting req.user from middleware function that has req.headers which is sent by frontend by headers in axios
  //so middleware lets us to use the user details through request

  exports.currentUser= async (req,res)=>{
    User.findOne({email:req.user.email}).then((user)=>{ 
       res.json(user);
    }).catch(err => console.log("currentUser-controllers-server error",err));
  }