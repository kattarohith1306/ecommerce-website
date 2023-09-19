import React  from "react";
import { Drawer,Button } from "antd";
import { useSelector,useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop.jpg";

//to make this component available globally as it should be shown as side bar ,it is imported in app.js
const SideDrawer = () => {
     
       const dispatch = useDispatch();
       const {drawer,cart} = useSelector((state) => ({...state}));
    const imageStyle = {
             width:'100%',
             height:'100px',
             objectFit:'cover',
    };
       return <Drawer 
       className="text-center text-dark"
       title={`Cart (${cart.length}) Products`}
       open={drawer} onClose={()=> {
        dispatch({
            type:"SET_VISIBLE",
            payload:false,
        });
       }}>
        {cart.map(( p )=> <div key={p._id} className="row">
                  <div className="col">
                    {p.images[0] ? (
                        <>
                        <img  src={p.images[0].url} style={imageStyle}/>
                        <p className="text-center bg-secondary bg-gradient text-white">{p.title} x {p.count}</p>
                        </>
                        
                    ) : (
                        <>
                        <img  src={laptop} style={imageStyle}/>
                        <p className="text-center bg-secondary bg-gradient text-white">{p.title} x {p.count}</p>
                        </> 
                    )}
                  </div>
        </div>)}
        <Link to="/cart" >
            <Button onClick={() => dispatch({type:"SET_VISIBLE",payload:false,})} className="btn btn-primary btn-raised text-large text-center btn-block">
             Go to Cart
            </Button>
        </Link>
       </Drawer>
};

export default SideDrawer;