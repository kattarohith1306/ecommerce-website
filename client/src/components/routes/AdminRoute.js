import React,{useEffect, useState} from "react";
import {  useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { Navigate } from "react-router-dom";
import { currentAdmin } from "../../functions/auth";

const AdminRoute= ({children}) => {
    const {user}=useSelector((state)=>({...state}));
    const [ok,setOk]=useState(false);
   //when this component mounts we are going to make req to backend  to get the response
   useEffect(()=>{
       if(user && user.token){
        currentAdmin(user.token)//this line makes req to backend
        .then((res)=>{
           console.log("CURRENT ADMIN RESPONSE",res);
           setOk(true);
        })
        .catch(err => {
            console.log("ADMIN ROUTE ERROR",err);
            setOk(false);
        })
       } 
   },[user]);

    return ok ? (
        children
    ) : (<LoadingToRedirect />);


}

export default AdminRoute;