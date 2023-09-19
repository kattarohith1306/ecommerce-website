import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import {getCategories} from "../../functions/category";

const CategoryList = ()=>{
      const [categories,setCategories] = useState([]);
      const [loading,setLoading] = useState(false);

      useEffect(()=>{
        setLoading(true);
        getCategories().then(c => {
              setLoading(false);
              setCategories(c.data);
              
        });
      },[]);//without dependency array iam making infinite get requests to api/categories so include dependency array
      
      const showCategories = () => categories.map((c)=><div className="col btn btn-outline-primary btn-lg btn-block btn-raised  m-3" key={c._id}>
         <Link to={`/category/${c.slug}`}>{c.name}</Link>
      </div>);

    return (<div className="container">
       <div className="row">
        {loading ? (<h4 className="text-danger text-center">Loading...</h4>) : showCategories()}
       </div>
    </div>); 
};

export default CategoryList;
