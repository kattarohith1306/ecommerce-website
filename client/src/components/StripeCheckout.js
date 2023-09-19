import React, { useEffect, useState } from "react";
import {
   CardElement,
    useStripe,
    useElements
  } from "@stripe/react-stripe-js";

import { useSelector,useDispatch } from "react-redux";
import { createPaymentIntent } from "../functions/stripe";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "antd";
import {DollarOutlined, CheckOutlined} from "@ant-design/icons";
import laptop from "../images/laptop.jpg";
import { createOrder,emptyUserCart } from "../functions/user";

const StripeCheckout = () => {
    
       const navigate = useNavigate();
       const dispatch = useDispatch();
       const {user,coupon} = useSelector((state) => ({...state}));
       const [error,setError] = useState(null);
       const [succeeded,setSucceeded] = useState(false);
       const [processing,setProcessing] = useState(false);
       const [disabled,setDisabled] = useState(true);
       const [clientSecret,setClientSecret] = useState("");
       const [cartTotal,setCartTotal] = useState(0);
       const [totalAfterDiscount,setTotalAfterDiscount] = useState(0);
       const [payable,setPayable] = useState(0);


       const stripe = useStripe();
       const elements = useElements();

       

       useEffect(()=>{
            createPaymentIntent(user.token,coupon)
            .then(res => {
                console.log("client payment intent",res.data);
                setClientSecret(res.data.clientSecret);
                //additional response recieved on successfull payment
                setCartTotal(res.data.cartTotal);
                setTotalAfterDiscount(res.data.totalAfterDiscount);
                setPayable(res.data.payable);
            });
       },[]);

       const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret,{
          payment_method:{
            card:elements.getElement(CardElement),
            billing_details:{
              name:e.target.name.value
            },
          },
        });

        if(payload.error){
                setError(`Payment failed ${payload.error.message}`);
                setProcessing(false);
        }else{
                //success
                createOrder(payload,user.token)
                .then(res => {
                  if(res.data.ok){
                    //empty cart from local storage
                    //empyt cart from redux and data base
                    if(typeof window !== undefined){
                      localStorage.removeItem("cart"); 
                    }
                    dispatch({
                      type:"ADD_TO_CART",
                      payload:[]
                    });

                    dispatch({
                      type:"COUPON_APPLIED",
                      payload:false,
                    })
                    emptyUserCart(user.token); 
                  }
                })
                console.log(JSON.stringify(payload,null,4));
                setError(null);
                setProcessing(false);  
                setSucceeded(true);
        }
       };

       const cartStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: "Arial, sans-serif",
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      };
      
      const handleChange = (e) => {
          setDisabled(e.empty);
          setError(e.error ? e.error.message : "");
      };

    return (
         <>
          {
            !succeeded && (<div>
              {(coupon && totalAfterDiscount !== undefined) ? (
                <p className="alert alert-success">
                {`Total after discount : $${totalAfterDiscount}`}
                </p>
              ) : (<p className="alert alert-danger">No Coupon Applied</p>)}
            </div>)
          }
          <div className="text-center pb-5">
           <Card 
            cover={<img src={laptop} style={{height:"200px",objectFit:"cover",marginBottom:"-50px"}}/>}
            actions={[
              <>
                <DollarOutlined className="text-info"/><br/>Total: ${cartTotal}
              </>,
              <>
                <CheckOutlined className="text-info"/><br/>Total payable: ${(payable / 100).toFixed(2)}
              </>,
            ]}
           />
          </div> 
            <form  id="payment-form" className="stripe-form" onSubmit={handleSubmit}>

             <CardElement id="card-element" options={cartStyle} onChange={handleChange}/>
            <button className="stripe-button" disabled={processing || !stripe || !elements}>
             <span id="button-text">
             {processing ? <div className="spinner" id="spinner"></div> : "Pay now"}
             </span>
            </button>
            <br/>
            {error && <div className="card-error" role="alert">{error}</div>}
            <br/>
            <p className={succeeded ? "result-message":"result-message hidden"}> 
             Payment Successfull.{" "}<Link to="/user/history">Go to purchase history</Link>
            </p>
            </form>
            
         </>
    );
};

export default StripeCheckout;