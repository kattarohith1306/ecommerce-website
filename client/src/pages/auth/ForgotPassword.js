import React,{useState,useEffect} from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword= () => {
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [loading,setLoading]=useState(false);

    const {user}= useSelector((state)=>({...state}));

    //it take couple of millisecond to fetch "user" so when "user" changes we should redirect to home page
    useEffect(()=>{
       if(user && user.token) navigate('/');
    },[user]);

    const handleSubmit= async (e) =>{
     e.preventDefault();//so the page doesnt reload
     setLoading(true);//when user submit we will show loading untill we get response from firebase
     const config={
        //the link that was sent to email should redirect to this url
        url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
        handleCodeInApp:true,
    };
      await sendPasswordResetEmail(auth,email,config)
      .then(()=>{
         setEmail("");
         setLoading(false);
         toast.success("check your email for password reset link");
      })
      .catch((err)=>{
        setLoading(false);
        toast.error(err.message);
        console.log("error message from forgot password",err);
      })
    }
    return <div className="container col-md-6 offset-md-3 p-5">
       {loading ? <h4  className="text-danger">Loading...</h4> : <h4>Forgot Password</h4>}
       <form onSubmit={handleSubmit}>
       <input
       type="email" 
       className="form-control form-control-lg" 
       value={email}
       onChange={(e)=>setEmail(e.target.value)} 
       placeholder="Your Email"
       autoFocus
       />
       <br/>
       <button type="submit" className="btn btn-raise" disabled={!email}>SUBMIT</button>
       </form>
    </div>

}

export default ForgotPassword;