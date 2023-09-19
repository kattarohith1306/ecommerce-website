
import React,{useEffect,useState} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount } from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { removeProduct } from "../../../functions/product";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
//this endpoint(admin/category) is first defined in AdminNav.js 

const AllProducts = () =>{

    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(false);
    const {user} = useSelector( state => ({...state}));
    const loadAllProducts = ()=>{
        setLoading(true);
        getProductsByCount(30)
        .then(res=>{
            setLoading(false);
          setProducts(res.data);
          
        })
        .catch(err=>{
            setLoading(false);
          console.log(err);
        });
    };

    const handleRemove  = (slug) => {
        let answer = window.confirm("Delete?");

        if(answer){
          // console.log("send delete request",slug);
          setLoading(true); 
          removeProduct(slug,user.token)
          .then(res=>{
            setLoading(false);
            loadAllProducts()
            toast.error(`${res.data.title} is deleted`);
          })
          .catch(err=>{
            setLoading(false);
            if(err.response.status=== 400 )toast.error(err.response.data);
            console.log(err);
          });
        }
    };

    useEffect(()=>{
      loadAllProducts();
    },[]);

    
     
    return( <div className="container-fluid"> 
    <div className="row">
    <div className="col-md-2">
    <AdminNav/>
    </div>

    <div className="col">
    
    {loading ? (<h4 className="text-danger">Loading...</h4>) : (<h4>All Products</h4>)}
    <div className="row">
    {products.map((product)=>(
      
      <div className="col-md-4" key={product._id}  >
     <AdminProductCard  product={product} handleRemove={handleRemove}/>
    
     </div>
     
     ))}
    </div>
       
    </div>

    </div>
    </div>);

};

export default AllProducts;