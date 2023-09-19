
import React from "react";
import { Link } from "react-router-dom";

const ProductListItems = ({product})=>{
   
    const {price,category,subs,shipping,color,brand,quantity,sold} = product;

    return (
        <ul className="list-group list-group-flush ">
         <li className="list-group-item d-flex justify-content-between align-items-start  fw-bold ">
            Price{" "} <span > $ {price}</span>
         </li>
         
         {category&&<li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Category{" "} <Link to={`/category/${category.slug}`}> {category.name}</Link>
         </li>}

         {subs && <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Sub Categories{" "}
            {subs.map((s)=><Link key={s._id} to={`/sub/${s.slug}`}>{s.name}</Link>)}
         </li>}

         <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Shipping{" "} <span >{shipping}</span>
         </li>
         <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Color{" "} <span >  {color}</span>
         </li>
        
         <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Brand{" "} <span >  {brand}</span>
         </li>

         <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Available{" "} <span >  {quantity}</span>
         </li>

         <li className="list-group-item d-flex justify-content-between align-items-start fw-bold mt-3">
            Sold{" "} <span > {sold}</span>
         </li>
        </ul>
    );
};

export default ProductListItems;