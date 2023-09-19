import React,{useState,useEffect} from "react";
import {auth} from "../../firebase";
import { toast } from 'react-toastify';
import {GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth";
import "firebase/compat/auth";
import { Button } from "antd";
import { MailOutlined ,GoogleOutlined} from "@ant-design/icons";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";

function Login(){
    const [email,setEmail]=useState("kattarohith.19je0428@mech.iitism.ac.in");
    const [password,setPassword]=useState("13602000");
    const [loading,setLoading]=useState(false);
    let dispatch=useDispatch(); 
    const navigate=useNavigate();
    const location=useLocation();
    //this user we are acessing is the data dispatched from createOrUpdateUser ,user key is what we defined in reducers
    const {user}= useSelector((state)=>({...state}));

       

    useEffect(()=>{
      let intended = location.state;
      if(intended){
         return ;// This line returns from the useEffect if intended is truthy
         //if return statement triggers no code in useEffect after this runs ,we come out of useEffect
      }else{
         if(user&&user.token){
            navigate('/');
          //when user tries to access login page even after login he will be redirected to home page 
         }
      }

   },[user,navigate]);

   const roleBasedRedirect = (res) => {
      let intended = location.state;
      if(intended){
         navigate(intended.from);
      }else{
         if(res.data.role==="admin"){
            navigate("/admin/dashboard");
          }else{
            navigate("/user/history");
          }

      }
          
   };
   

   const handleSubmit= async (e)=>{
    
    e.preventDefault();
    setLoading(true);
    //console.table(email,password);
    try{
       //we should wait for the result before dispatching the user details , to avoid error we use await.
      const result = await signInWithEmailAndPassword(auth,email,password);
      //console.log(result)
      const {user}=result;
      
      const idTokenResult= await user.getIdTokenResult();

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
        });

          roleBasedRedirect(res);

      }).catch(err => console.log("createOrUpdateUser error",err));

      
      //  navigate("/");

    }catch(err){
      console.log(err);
      toast.error(err.message);
      setLoading(false);
    }
   };


    const loginForm=()=>(
        <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
            <input type="email" 
            className="form-control form-control-lg" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="Your Email"
            autoFocus
            ></input>
            </div>
           <div className="input-group mb-3">
           <input type="password" 
            className="form-control form-control-lg" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)} 
            placeholder="Your Password"
            ></input>
           </div>
          
           <Button
            onClick={handleSubmit}
            type="primary"
            className="mb-3"
            block
            shape="round"
            icon={<MailOutlined/>}
            size="large"
            disabled={!email || password.length<6}
            >Login with Email/Password</Button>
        
         
            
        </form>
    );
      const googleLogin= async ()=>{
        const provider=new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async (result)=>{
            const {user}=result;
            const idTokenResult= await user.getIdTokenResult();
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
              });
           
              roleBasedRedirect(res);
            }).catch(err => console.log("createOrUpdateUser error",err));
      
      //  navigate("/");
        }).catch(err => {
           console.log(err);
           toast.error(err.message); 
        });
      }
    return <div className="container p-5">

    <div className="row">
    <div className="col-md-6 offset-md-3">
         { !loading ?( <h4>Login</h4> ): (<h4 className="text-danger">Loading...</h4>)}
         {loginForm()}
         <Button
            onClick={googleLogin}
            type="primary"  
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
            danger
            >Login with Google</Button>
           <Link to="/forgot/password" className="float-end text-danger"  >Forgot Password</Link>
    </div>
    </div>
    </div>;
}

export default Login;