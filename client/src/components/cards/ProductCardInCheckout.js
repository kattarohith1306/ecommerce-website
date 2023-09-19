import React from "react";
import ModalImage from "react-modal-image";
import laptop from "../../images/laptop.jpg";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CheckCircleOutlined,CloseCircleOutlined,CloseOutlined } from "@ant-design/icons";

const ProductCardInCheckout = ({p}) => {

    const dispatch = useDispatch();

    const colors = ["Black","Brown","Silver","White","Blue"];
    //for event handler we dont need to pass anything we get event automatically
    const handleColorChange = (e) => {
        //  console.log(e.target.value);

         let cart = [];
         if(typeof window !==undefined){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product,i) => {
                if(product._id === p._id) {
                    cart[i].color = e.target.value;
                }
            });

            // console.log('cart update color',cart)
            localStorage.setItem('cart',JSON.stringify(cart));

            dispatch({
              type:"ADD_TO_CART",
              payload:cart,
            });
         }
    };

    const handleQunatityChange = (e) => {
        let cnt  =  e.target.value < 1 ? 1:e.target.value ;

        if(cnt > p.quantity){
            toast.error(`Max quantity available ${p.quantity}`);
            return;
        }
        let cart = [];
        if(typeof window !== undefined){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product,i) => {
                if(product._id === p._id){
                    cart[i].count = cnt;
                }
            });

            localStorage.setItem('cart',JSON.stringify(cart));

            dispatch({
                type:"ADD_TO_CART", 
                payload:cart,
            })
        }

    };

    const handleRemove = () => {
          
        let cart = [];
        if(typeof window !== undefined){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product,i) => {
                if(product._id === p._id){
                    cart.splice(i,1);
                }
            });

            localStorage.setItem('cart',JSON.stringify(cart));

            dispatch({
                type:"ADD_TO_CART", 
                payload:cart,
            })
        }
    };


    return (
        <tbody >
           <tr>
            <td>
            <div style={{width:"100px",height:'auto'}}>
                {p.images.length ? (
                <ModalImage small={p.images[0].url} large={p.images[0].url}/>
                ):(
                <ModalImage small={laptop} large={laptop}/>
                )}
            </div>
            </td>
            <td>{p.title}</td>
            <td>${p.price}</td>
            <td>{p.brand}</td>
            <td>
                <select onChange={handleColorChange} name="color" className="form-control">
                    {p.color ? <option value={p.color } >{p.color}</option> : <option>Select</option>}
                    {colors.filter( (c) => c!==p.color ).map((c) => <option key={c} value={c} >{c}</option>)}
                </select>
            </td>
            <td >
              <input type="number" className="form-control text-center" value={p.count} onChange={handleQunatityChange}/>
            </td>
            <td>
                {p.shipping === "Yes" ? <CheckCircleOutlined className="text-success text-center"/>:<CloseCircleOutlined className="text-danger text-center"/>}
            </td>
            <td><CloseOutlined onClick={handleRemove} className="text-danger text-center" style={{cursor:"pointer"}}/></td>
           </tr>
        </tbody>
    );
};

export default ProductCardInCheckout;