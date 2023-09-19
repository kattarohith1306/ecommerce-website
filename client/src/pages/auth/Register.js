import React,{useEffect, useState} from "react";
import {auth} from "../../firebase";
import { toast } from 'react-toastify';
import {sendSignInLinkToEmail} from "firebase/auth";
import "firebase/compat/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register(){
    const [email,setEmail]=useState("");
    
    const {user}= useSelector((state)=>({...state}));
    const navigate=useNavigate();
    
    useEffect(()=>{
    if(user && user.token)navigate("/");
    },[user]);
    
   const handleSubmit= async (e)=>{
    
    e.preventDefault();
    
    const config={
        //the link that was sent to email should redirect to this url
        url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
        handleCodeInApp:true,
    };
     
     sendSignInLinkToEmail(auth,email,config).then(()=>{
       window.localStorage.setItem('emailForSignIn', email);
     });
     toast.success(`email is sent to ${email}`);
     setEmail("");
   };


    const registerForm=()=>(
        <form onSubmit={handleSubmit}>
            <input type="email" 
            className="form-control" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="Your Email"
            autoFocus
            ></input>
            <br/>
            <button type="submit" className="btn btn-raise" >REGISTER</button>
        </form>
    );

    return <div className="container p-5">

    <div className="row">
    <div className="col-md-6 offset-md-3">
         <h4>Register</h4>
         {registerForm()}
    </div>
    </div>
    </div>;
}

export default Register;