import React,{useState,useEffect} from "react";
import { getCategory } from "../../functions/category";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";


const CategoryHome = () => {
       const [category,setCategory] = useState({});
       const [products,setProducts] = useState([]);
       const [loading,setLoading] = useState(false);
       const { slug } = useParams();

       useEffect(()=>{
           setLoading(true);
           getCategory(slug).then(res => {
            setLoading(false);
            console.log(JSON.stringify(res.data,null,4))
            setCategory(res.data.category);
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
                {products.length} products in "{category.name}" category
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


export default CategoryHome;