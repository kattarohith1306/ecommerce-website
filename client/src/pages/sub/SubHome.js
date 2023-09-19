import React,{useState,useEffect} from "react";
import { getSub } from "../../functions/sub";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";


const SubHome = () => {
       const [sub,setSub] = useState({});
       const [products,setProducts] = useState([]);
       const [loading,setLoading] = useState(false);
       const { slug } = useParams();

       useEffect(()=>{
           setLoading(true);
           getSub(slug).then(res => {
            setLoading(false);
            console.log(JSON.stringify(res.data,null,4))
            setSub(res.data.sub);
            setProducts(res.data.products);
        });
       },[]);


    return (
        <div className="container-fluid">
        <div className="row"> 
        <div className="col">
        {loading ? (
            <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4">Loading...</h4>
        ): (
            <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4">
                {products.length} products in "{sub.name}" sub category
            </h4>
        )}
        </div>
        </div>
        <div className="row">
         {products.length && products.map((p)=><div className="col-md-4" key={p._id}>
          <ProductCard product={p}/>
         </div>)}
        </div>
        </div>
    );

};


export default SubHome;