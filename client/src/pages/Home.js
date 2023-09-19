import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import BestSellers from "../components/home/BestSellers";
import NewArrivals from "../components/home/NewArrivals";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";

const Home=()=>{

    
    return ( 
        <>
    <div className="jumbotron bg-success  bg-gradient mb-5 p-5 text-white h1 text-center font-weight-bold">
       <Jumbotron text={["Latest Products","New Arrivals","Best Sellers"]}/>
    </div>
         
    <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4"> New Arrivals</h4>
          
    <NewArrivals />

    <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4"> Best Sellers</h4>

    <BestSellers />

    <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4"> Categories</h4>

    <CategoryList />

    <h4 className="text-center bg-dark bg-gradient text-white p-3 mt-5 mb-5 jumbotron display-4"> Sub Categories</h4>

    <SubList />
    <br/>
    <br/>
    </>);
};

export default Home;