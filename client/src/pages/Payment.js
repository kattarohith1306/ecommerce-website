import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout.js";
import "../stripe.css";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
    return (
       <div className="container p-5 text-center text-dark">
       <h4>Complete your payment</h4>
       <Elements stripe={stripePromise}>
       <div className="col-md-8 offset-md-2">
       <StripeCheckout />
       </div>
       </Elements>
       </div>
    );
};

export default  Payment;