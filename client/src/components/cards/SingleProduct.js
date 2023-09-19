import React,{useState} from "react";
import { Card,Tabs,Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { HeartOutlined,ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import laptop from "../../images/laptop.jpg";
import ProductListItems from "./ProductListItems";
import StarRatings from 'react-star-ratings';
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import { useSelector,useDispatch } from "react-redux";
import _ from "lodash";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";


//this is children component of Product.js page
const SingleProduct = ({product,onStarClick,star}) => {
  
    const {title,images,description,_id} = product;
    const [tooltip,setTooltip] = useState("Click to add");
    const navigate = useNavigate();
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
          payload:true,
         })
      }
  };

    const items = [
      {
        key: '1',
        label: 'Description',
        children: description,
      },
      {
        key: '2',
        label: 'More',
        children: `Call us on 8688278445, email:kannayyakatta@gmail.com` ,
      },
    ];

    const onChange = (key) => {
      console.log(key);
    };

     const handleAddToWishlist = (e) => {
           e.preventDefault();
           addToWishlist(product._id,user.token).then( res  => {
            console.log(res.data);
            toast.success("Added to wishlist");
            navigate("/user/wishlist");
           });
     };

         return (
            <>
               
                <div className="col-md-7">
                   {images && images.length ? <Carousel showArrows={true} autoPlay infiniteLoop>
                    {images && images.map((i)=><img src={i.url} key={i.public_id}/>)}
                   </Carousel> : 
                   <Card cover={<img src={laptop} className="card-img mb-3" />} />
                   }
                   <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                </div>

                <div className="col-md-5">
                <h1 className="bg-info p-3 text-dark">{title}</h1>
                 {product && product.ratings && product.ratings.length>0 ?
                  showAverage(product) 
                  :
                   <div className="text-center pt-1 pb-3 text-dark ">No rating yet</div>
                   }
          
                  <Card
                  actions={[
                    <Tooltip title={tooltip}>
                 <a onClick={handleAddToCart}><ShoppingCartOutlined  className="text-danger"/><br/>Add to cart</a>
            </Tooltip>,
                   <a onClick={handleAddToWishlist }>
                   <HeartOutlined className="text-info"/><br/>
                   Add to Wishlist
                  </a>,
                   <RatingModal>
                <StarRatings 
                  name={_id}
                  numberOfStars={5}
                  rating={star}
                  // changeRating={(newRating, name)=>console.log("newRating",newRating,"name",name)}//this name in changeRating is productId
                  changeRating={onStarClick}
                  isSelectable={true}
                  starRatedColor="red"
                />
                </RatingModal>,
            ]}
                  >
                 <ProductListItems product={product}/>
                  </Card>
                </div>
            </>
         );
};

export default SingleProduct;