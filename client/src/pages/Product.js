import React,{useState,useEffect} from "react";
import { getProduct,productStar,getRelated } from "../functions/product";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct"
import { useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductCard";


const Product = () => {
    const [product,setProduct] = useState({});
    const [star,setStar] = useState(0);
    const [related,setRelated]=useState([]);
    const {user} = useSelector((state)=>({...state}))
    const  {slug} = useParams();

    useEffect(()=>{
      loadSingleProduct();
    },[slug]);

    useEffect(()=>{
           if(product.ratings && user){
            let existingRatingObject = product.ratings.find((e)=>(e.postedBy.toString() === user._id.toString())); 
            existingRatingObject&&setStar(existingRatingObject.star);//
           }
    },[]);//without dependency array there were continuous rerenders

    const loadSingleProduct = () => {
      getProduct(slug).then(res=>{
        setProduct(res.data);
        //load related 
        getRelated(res.data._id).then(result => setRelated(result.data))
      });
    };
   

    const onStarClick =  (newRating,name) => {
      console.table(newRating,name);
         setStar(newRating);//we should send this newRating to backend
         //name:_id name contains product id assigned in SingleProduct
         productStar(name,newRating,user.token)
         .then(res=>{
          console.log("Rating clicked",res.data);
          loadSingleProduct();//shows the updated rating in realtime by reloading
         });
    };

    return <div className="container-fluid">
         <div className="row pt-4">
            <SingleProduct product={product} onStarClick={onStarClick} star={star}/>
         </div> 
         <div className="row p-5 h2">
         <div className="col text-center pt-5 pb-5 text-dark">
         <hr/>
         <h4>Related Products</h4>
         <hr/>
         </div>
         </div>
         <div className="row pb-5">
         {related.length ? related.map((r)=><div key={r._id} className="col-md-4">
          <ProductCard  product={r}/>
         </div>) : <div className="text-center col">No related products</div>}
         </div>
    </div>
};

export default Product;