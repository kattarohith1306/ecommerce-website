import React,{ useState } from "react";
import {Menu,Badge} from "antd";
import { 
  HomeOutlined,
  SettingOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import {auth} from "../../firebase";
import { useDispatch,useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";
import Search from "../forms/Search";

//if there are more than 2 role declare a function and you can send multiple end points based on different role in children of submenu
const generateMenuItems=(user,cart)=>{
  const items1 = [
    {
      label: <Link to="/" >Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/shop" >Shop</Link>,
      key: 'shop',
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to="/cart" ><Badge count={cart.length} offset={[9,0]}>Cart</Badge></Link>,
      key: 'cart',
      icon: <ShoppingCartOutlined />,
    },
    {
      label: <span ><Search/></span>,
      key: 'search',
      style: {"marginLeft":"auto"},
    },
    {
      label: <Link to="/username" >{user && user.email.split('@')[0]}</Link>,
      key: 'SubMenu',
      icon: <SettingOutlined />,
      // style: {"marginLeft":"auto"},
      children: 
         [
            {
              label: <Link to={user&&user.role ==="admin" ? "admin/dashboard":"/user/history"}>Dashboard</Link>,
              key: 'setting:1',
            },
            {
              icon:<LogoutOutlined/>,
              label: "Logout",
              key:'logout',
              
            },
          ],
        },
 
    
  ];

  const items2=[
    
    {
      label: <Link to="/" >Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/shop" >Shop</Link>,
      key: 'shop',
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to="/cart" ><Badge count={cart.length} offset={[9,0]}>Cart</Badge></Link>,
      key: 'cart',
      icon: <ShoppingCartOutlined />,
    },
    {
      label: <span ><Search/></span>,
      key: 'search',
      style: {"marginLeft":"auto"},
    },
    {
      label: <Link to="/login" >Login</Link>,
      key: 'login',
      icon: <LoginOutlined />,
     
    },
    {
      label: <Link to="/register" >Register</Link>,
      key: 'register',
      icon:<UserAddOutlined />,
    },
    
  ]

  return user ? items1 : items2 ;

}

  const Header = () => {
    const [current, setCurrent] = useState('home');
    let dispatch=useDispatch();
    let {user,cart}=useSelector((state)=>({...state}));
    const navigate=useNavigate();
    
    
    
    const logout=()=>{
      console.log("logout");
      auth.signOut();
      dispatch({
        type:"LOGGED_OUT_USER",
        payload:null,
      });
      navigate("/login");
    };
   
    const onClick = (e) => {
      console.log('click ', e);

      setCurrent(e.key);
   
      if(e.key === "logout"){
        logout();
      }
      
    }; 
    
    

    return <Menu onClick={onClick}  selectedKeys={[current]} mode="horizontal" items={generateMenuItems(user,cart)} />;
  };

  export default Header;