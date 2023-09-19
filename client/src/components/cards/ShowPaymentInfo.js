import React from "react";

const ShowPaymentInfo = ({order,showStatus = true}) => (
    <div>
        <span>Order Id : {order.paymentIntent.id}</span>{" /  "}
        <span>Amount : {(order.paymentIntent.amount/=10).toLocaleString("en-US",{
            style:"currency",
            currency:"INR"
        })}</span>{" /  "}
        <span>Currency :{order.paymentIntent.currency.toUpperCase()}</span>{" /  "}
        <span>Method : {order.paymentIntent.payment_method_types[0]}</span>{" /  "}
        <span>Paymeny : {order.paymentIntent.status}</span>{" "}
        <span>Ordered on : {new Date(order.paymentIntent.created*1000).toLocaleString()}</span>{"  / "}
       {showStatus && <span className="badge bg-primary text-while">STATUS : {order.orderStatus}</span>}
    </div>
);

export default ShowPaymentInfo;