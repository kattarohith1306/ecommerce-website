import React, { useState } from "react";
import { Card,Tooltip } from "antd";
import laptop from "../../images/laptop.jpg";
import { EyeOutlined,ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import {useSelector ,useDispatch } from "react-redux";


const {Meta} = Card;
const ProductCard = ({product}) =>{
 
    const [tooltip,setTooltip] = useState("Click to add");

    //redux
    const {user,cart} = useSelector(state => ({...state}));
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        //create cart array
        let cart = [];
        if(typeof window !== "undefined"){
            //if cart in in local storage, get it  ,if user might have already added products earlier we get them
            if(localStorage.getItem('cart'))  {
                //items are stores as json data in local storage so we parse them
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            //push new product to cart 
            cart.push({
                ...product,
                count:1,//we add new property "count" to product
            });
            //remove duplicates
            let unique = _.uniqWith(cart,_.isEqual);
            //save to localstorage
            localStorage.setItem('cart',JSON.stringify(unique));
            //show tooltip
           setTooltip("Added");
           //add to redux state
           dispatch({
            type:"ADD_TO_CART",
            payload : unique,
           });

           //show cart items in side drawer
           dispatch({
            type:"SET_VISIBLE",
            payload : true,
           });

        }
    };
 
  const { images,title,description,slug,price,quantity } = product;

    return (
        <>  
        {product && product.ratings && product.ratings.length>0 ?
                  showAverage(product) 
                  :
                   <div className="text-center pt-1 pb-3 text-dark ">No rating yet</div>
       }
          
        <Card
            hoverable
            className="m-2" 
            cover={
            <img style={{height:"250px",objectFit:"cover"}} 
            src={images && images.length ? images[0].url:laptop}      
            />}
            actions={[
            <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning"/><br/>View Product
            </Link>,
            <Tooltip title={tooltip}>
                 <a onClick={handleAddToCart} disabled = { quantity < 1 }>
                 <ShoppingCartOutlined  className="text-danger" />
                 <br/>{quantity<1 ? <p className="alert-danger">Out of Stock</p> : "Add to Cart"}</a>
            </Tooltip>,
            ]}
            >

        <Meta title={`${title} - $${price}`} description={`${description&&description.substring(0,35)}...`} />
        </Card>
        </>
    );

};


export default ProductCard;