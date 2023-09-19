import React from "react";
import {useSelector,useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import { userCart } from "../functions/user";

const Card = () => {

    const {user,cart} = useSelector((state) => ({...state}));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getTotal = () => {
        return cart.reduce((currentVal,nextVal) => {
            return currentVal + nextVal.count * nextVal.price ;
        },0)
    };


    const saveOrderToDb = () => {
        //    console.log("cart",JSON.stringify(cart));
        userCart(cart,user.token)
        .then( res => {
            console.log("CART POST RESPONSE",res);
           if(res.data.ok) navigate("/checkout");
        }).catch(err => console.log('CART POST ERROR',err));
        
    };

    const showCartItems = () => {
        return <table className="table table-bordered">
            <thead className="table-active text-dark">
                <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Color</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Shipping</th>
                    <th scope="col">Remove</th>
                </tr>
            </thead>
            {cart.map(p => <ProductCardInCheckout  key={p._id} p={p}/>)}
        </table>
    };

    const saveCashOrderToDb = () => {
 
        dispatch({
        type:"COD",
        payload:true,
        });
        userCart(cart,user.token)
        .then( res => {
            console.log("CART POST RESPONSE",res);
           if(res.data.ok) navigate("/checkout");
        }).catch(err => console.log('CART POST ERROR',err));
        
    };

    return <div className="container-fluid pt-2 text-dark">

            <div className="row">
                <div className="col-md-8">
                <h4>Cart / {cart.length} Product </h4>
                    {!cart.length ? (<p>No products in the cart. <Link to="/shop">Continue Shopping</Link></p>)
                    :
                    ( showCartItems())}
                </div>
                <div className="col-md-4">
                    <h4>Order Summary</h4>
                    <hr/>
                    <p>Products</p>
                    {cart.map((c,i) => (
                        <div key={i}>
                              <p>{c.title} x {c.count} = ${c.price * c.count}</p>
                        </div>
                    ))}
                    <hr/>
                    Total : <b>${getTotal()}</b>
                    <hr/>
                    {user ? (
                        <>
                        <button onClick={saveOrderToDb} className="btn  btn-primary mt-2" disabled={!cart.length}>
                            Proceed to Checkout
                        </button>
                        <br/>
                        <button onClick={saveCashOrderToDb} className="btn  btn-secondary mt-2" disabled={!cart.length}>
                            Cash on Delivery
                        </button>
                        </>
                        
                    ) : (
                            <Link to="/login" state={{from :"/cart"}}><button className="btn  btn-primary mt-2">Login to checkout</button> </Link>
                    )}
                </div>
            </div>
    </div>
};

export default Card;