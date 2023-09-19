import React from "react";
import {  useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { Navigate } from "react-router-dom";

const UserRoute= ({children}) => {
    const {user}=useSelector((state)=>({...state}));

    return user && user.token ? (
        children
    ) : (<LoadingToRedirect />);


}

export default UserRoute;