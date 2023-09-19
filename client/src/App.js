import React,{useEffect,lazy,Suspense} from "react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route } from "react-router-dom";

import {auth} from "./firebase.js";
import { getIdTokenResult, onAuthStateChanged } from "firebase/auth";
import {useDispatch} from "react-redux";
import { currentUser } from "./functions/auth.js";
import { LoadingOutlined } from "@ant-design/icons";

// import Home from "./pages/Home.js";
// import Register from "./pages/auth/Register";
// import Login from "./pages/auth/Login";
// import Header from "./components/nav/Header";
// import RegisterComplete from "./pages/auth/RegisterComplete.js";
// import ForgotPassword from "./pages/auth/ForgotPassword.js";
// import History from "./pages/user/History.js";
// import UserRoute from "./components/routes/UserRoute.js";
// import Password from "./pages/user/Password.js";
// import Wishlist from "./pages/user/Wishlist.js";
// import AdminRoute from "./components/routes/AdminRoute.js";
// import AdminDashboard from "./pages/admin/AdminDashboard.js";
// import CategoryCreate from "./pages/admin/category/CategoryCreate.js";
// import CategoryUpdate from "./pages/admin/category/CategoryUpdate.js";
// import SubCreate from "./pages/admin/sub/SubCreate.js";
// import SubUpdate from "./pages/admin/sub/SubUpdate.js";
// import ProductCreate from "./pages/admin/product/ProductCreate.js";
// import AllProducts from "./pages/admin/product/AllProducts.js";
// import ProductUpdate from "./pages/admin/product/ProductUpdate.js";
// import Product from "./pages/Product.js";
// import CategoryHome from "./pages/category/CategoryHome.js";
// import SubHome from "./pages/sub/SubHome.js";
// import Shop from "./pages/Shop.js";
// import Cart from "./pages/Cart.js";
// import SideDrawer from "./components/drawer/SideDrawer.js";
// import Checkout from "./pages/Checkout.js";
// import CreateCoupon from "./pages/admin/coupon/CreateCoupon.js";
// import Payment from "./pages/Payment.js";

const Home = lazy(() => import("./pages/Home.js"));
const Register = lazy(() => import("./pages/auth/Register"));
const Login = lazy(() => import("./pages/auth/Login"));
const Header = lazy(() => import("./components/nav/Header"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete.js"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.js"));
const History = lazy(() => import("./pages/user/History.js"));
const UserRoute = lazy(() => import("./components/routes/UserRoute.js"));
const Password = lazy(() => import("./pages/user/Password.js"));
const Wishlist = lazy(() => import("./pages/user/Wishlist.js"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute.js"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.js"));
const CategoryCreate = lazy(() => import("./pages/admin/category/CategoryCreate.js"));
const CategoryUpdate = lazy(() => import("./pages/admin/category/CategoryUpdate.js"));
const SubCreate = lazy(() => import("./pages/admin/sub/SubCreate.js"));
const SubUpdate = lazy(() => import("./pages/admin/sub/SubUpdate.js"));
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate.js"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts.js"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate.js"));
const Product = lazy(() => import("./pages/Product.js"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome.js"));
const SubHome = lazy(() => import("./pages/sub/SubHome.js"));
const Shop = lazy(() => import("./pages/Shop.js"));
const Cart = lazy(() => import("./pages/Cart.js"));
const SideDrawer = lazy(() => import("./components/drawer/SideDrawer.js"));
const Checkout = lazy(() => import("./pages/Checkout.js"));
const CreateCoupon = lazy(() => import("./pages/admin/coupon/CreateCoupon.js"));
const Payment = lazy(() => import("./pages/Payment.js"));





const App=()=>{
   
  const dispatch=useDispatch();
  //check the firebase auth state and we are going to access the currently logged in user iin firebase
     useEffect(()=>{
       const unsubscribe=onAuthStateChanged(auth,async (user)=>{
         if(user){
            const idTokenResult= await getIdTokenResult(user);
          //  console.log("user",user);
          currentUser(idTokenResult.token)
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
      }).catch(err => console.log("currentUser error",err));

           
         }    
       });
     //cleanup
     return () => unsubscribe();
     })

   return (
      <Suspense fallback={
        <div className="col text-center p-5">
          __EC<LoadingOutlined />MMERCE built by KATTA ROHITH__
        </div>
      }>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Routes>
       <Route path="/"  element={<Home />}></Route>
       <Route path="/register" element={<Register />}></Route>
       <Route path="/login" element={<Login />}></Route>
       <Route path="/register/complete" element={<RegisterComplete />}></Route>
       <Route path="/forgot/password" element={<ForgotPassword />}></Route>
       <Route path="/user/history" element={<UserRoute><History /></UserRoute>}></Route>
       <Route path="/user/password" element={<UserRoute><Password /></UserRoute>}></Route>
       <Route path="/user/wishlist" element={<UserRoute><Wishlist /></UserRoute>}></Route>
       <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>}></Route>
       <Route path="/admin/category" element={<AdminRoute><CategoryCreate/></AdminRoute>}></Route>
       <Route path="/admin/category/:slug" element={<AdminRoute><CategoryUpdate/></AdminRoute>}></Route>
       <Route path="/admin/sub" element={<AdminRoute><SubCreate/></AdminRoute>}></Route>
       <Route path="/admin/sub/:slug" element={<AdminRoute><SubUpdate/></AdminRoute>}></Route>
       <Route path="/admin/product" element={<AdminRoute><ProductCreate/></AdminRoute>}></Route>
       <Route path="/admin/products" element={<AdminRoute><AllProducts/></AdminRoute>}></Route>
       <Route path="/admin/product/:slug" element={<AdminRoute><ProductUpdate/></AdminRoute>}></Route>
       <Route path="/product/:slug" element={<Product />}></Route>
       <Route path="/category/:slug" element={<CategoryHome />}></Route>
       <Route path="/sub/:slug" element={<SubHome />}></Route>
       <Route path="/shop" element={<Shop />}></Route>
       <Route path="/cart" element={<Cart />}></Route>
       <Route path="/checkout" element={<UserRoute><Checkout /></UserRoute>}></Route>
       <Route path="/admin/coupon" element={<AdminRoute><CreateCoupon /></AdminRoute>}></Route>
       <Route path="/payment" element={<UserRoute><Payment /></UserRoute>}></Route>
      </Routes>
      </Suspense>
      
   
   );
}


export default App;
