import React,{useEffect,useState} from "react";
import { useSelector,useDispatch } from "react-redux";
import { getUserCart,emptyUserCart,saveUserAddress,applyCoupon,createCashOrderForUser } from "../functions/user";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
     
    const navigate = useNavigate();
    const [products,setProducts] = useState([]);
    const [total,setTotal] = useState(0);
    const [address,setAddress] = useState("");
    const [addressSaved,setAddressSaved] = useState(true);
    const [coupon ,setCoupon] = useState("");
    //discount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState('');
    const [discountError,setDiscountError] = useState("");
    const dispatch = useDispatch();
    const {user,COD} = useSelector((state) => ({...state}));
    const  couponBoolean = useSelector((state) => state.coupon);

    useEffect(()=>{
       getUserCart(user.token)
       .then( res =>{ 
        console.log('user cart res--->',JSON.stringify(res.data, null, 4));
        setProducts(res.data.products);
        setTotal(res.data.cartTotal);
    })
    },[])

    const emptyCart = () => {
            
        //remove from local storage
        if(typeof window !== undefined ){
            localStorage.removeItem("cart");
        }

        //remove from redux
        dispatch({
            type:"ADD_TO_CART",
            payload:[],
        });
        //remove from backend
           emptyUserCart(user.token).then(res => {
             setProducts([]);
             setTotal(0);
             setTotalAfterDiscount(0);
             setCoupon("");
             toast.success("Cart is empty.continue shopping");
           })
    };

    const saveAddressToDb = () => {
        //   console.log(address);
        saveUserAddress(user.token,address).then(
            res =>{
                if(res.data.ok){
                    setAddressSaved(false);
                }
                toast.success("Address saved")
            }
        )
    };

    const applyDiscountCoupon = () => {
        // console.log(coupon);
        applyCoupon(user.token,coupon)
        .then(res => {
            console.log("RES ON COUPON APPLIED",res.data);
            if(res.data){
                setTotalAfterDiscount(res.data);
                //update redux coupon applied
                dispatch({
                    type:"COUPON_APPLIED",
                    payload:true,
                });
            }

            if(res.data.err){
                setDiscountError(res.data.err);
                //update redux coupon applied
                dispatch({
                    type:"COUPON_APPLIED",
                    payload:false,
                });
            }
        })
    }

    const showApplyCoupon = () => {
          return <>
            <input 
            onChange={ e =>{ 
                setCoupon(e.target.value)
                setDiscountError("");
                }} 
            value={coupon}
            type="text" 
            className="form-control"/>
            <button className="btn btn-primary mt-2" onClick={applyDiscountCoupon}>Apply</button>
          </>
    };

     const createCashOrder = () => {
        createCashOrderForUser(user.token,COD,couponBoolean).then(res => {
            // console.log("USER COD create",res);
            //empty cart from redux localstorage,reset coupon,reset cod,redirect
            if(res.data.ok){
                  if(typeof window !== undefined){
                    localStorage.removeItem("cart");
                  }
                    dispatch({
                        type:"ADD_TO_CART",
                        payload:[],
                    });

                    dispatch({
                        type:"COUPON_APPLIED",
                        payload:false,
                    });

                    dispatch({
                        type:"COD",
                        payload:false,
                    });
                  emptyUserCart(user.token);
                  setTimeout(()=>{
                       navigate("/user/history");
                  },1000)
            }
        })
     };
    

    return (
        <div className="row text-dark">
            <div className="col-md-6">
               <h4>Delivery Address</h4>
               <br/>
               <br/>
               <ReactQuill theme="snow" value={address} onChange={setAddress}/>
               <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
               Save
               </button>
               <hr/>
               <br/>
               <h4>Apply Coupon</h4>
               {showApplyCoupon()}
               <br/>
               {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>

            <div className="col-md-6">
                 <h4>Order Summary</h4>
                 <hr/>
                 <p>Products {products.length}</p>
                 <hr/>
                 {products.map( (p , i) => <div key={i}>
                      <p>{p.product.title} ({p.color}) x {p.count} = ${p.product.price * p.count}</p>
                 </div>)}
                 <hr/>
                 <p>Cart Total: ${total}</p>
                 {totalAfterDiscount>0 && <p className="bg-success p-2">Discount Applied, Final price ${totalAfterDiscount}</p>}
                 <hr/>
                 <div className="row">
                    <div className="col-md-6">
                    {COD ? (<button onClick={createCashOrder} disabled={addressSaved || !products.length} className="btn btn-primary">
                            Place Order
                        </button>)
                        :
                        (
                       <button onClick={()=>navigate("/payment")} disabled={addressSaved || !products.length} className="btn btn-primary">
                            Place Order
                        </button>
                        )}
                    </div>
                    <div className="col-md-6">
                        <button 
                        disabled={!products.length} 
                        onClick={emptyCart} 
                        className="btn btn-primary">
                            Empty Cart
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};
export default Checkout;