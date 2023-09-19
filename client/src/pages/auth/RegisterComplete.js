import React,{useEffect, useState,} from "react";
import {auth} from "../../firebase";
import {getIdTokenResult, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from "firebase/auth";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";


const RegisterComplete=()=>{
     const [email,setEmail]=useState("");
     const [password,setPassword]=useState("");
     const navigate=useNavigate();
     const dispatch=useDispatch();
     
  

      useEffect(()=>{
        setEmail(window.localStorage.getItem("emailForSignIn"));
        
      },[]);

   const handleSubmit=async (e)=>{
      e.preventDefault();
      
      if(!email || !password){
        toast.error("Email and Password are required");
        return;
      }

      if(password&&password.length<6){
        toast.error("password length shoult be atleast 6 characters");
        return;
      }

      if(isSignInWithEmailLink(auth,window.location.href)){
        try{
          const result = await signInWithEmailLink(auth,email,window.location.href);
          // console.log("RESULT",result);
        if(result.user.emailVerified){
          //removing emial from local storage
          window.localStorage.removeItem("emailForSignIn");
          //get user id token ,this token will be used to connect with backend
          let currUser=auth.currentUser;
          await updatePassword(currUser,password);
          const idTokenResult=await getIdTokenResult(currUser);
          console.log("user",currUser,"id",idTokenResult);
          //redux store
          createOrUpdateUser(idTokenResult.token)
          .then(res => {
          dispatch({
          type:"LOGGED_IN_USER",
           payload:{
            name:res.data.name,
            email:res.data.email,
            token:idTokenResult.token,
            role:res.data.role,
            _id:res.data._id,
         }
        });}).catch(err => console.log("createOrUpdateUser error",err));

          //redirect
          navigate("/");

        }
        }catch(err){
          console.log(err);
        }

      }
        
      
   }
  const  RegistrationForm=()=>(
  <form onSubmit={handleSubmit}>
     <input
     type="email"
     className="form-control"
     placeholder="Email"
     value={email}
     disabled
     />

     <input
      type="password"
      className="form-control"
      placeholder="Password"
      value={password}
      onChange={(e)=>setPassword(e.target.value)}
      autoFocus
     />
     <br/>
     <button type="submit" className="btn btn-raise" >COMPLETE REGISTRATION</button>
     
  </form>);
   
  return (<div className="container p-5">
    <div className="row">
    <div className="col-md-6 offset-md-3">
    <h4>Register Complete</h4>
    {RegistrationForm()}
    </div>
    </div>
    </div>)

}

export default RegisterComplete;