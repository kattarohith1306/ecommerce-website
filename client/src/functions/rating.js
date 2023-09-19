import React from "react";
import StarRatings from "react-star-ratings";

export const showAverage = (p)=>{
      if(p && p.ratings){
          let ratingsArray = p && p.ratings;
          let total=[];
          let length = ratingsArray.length;
        //   ratingsArray.map((r)=>total.push(r.star));//chatgpt said this could lead to unexpected behaviour
          total = ratingsArray.map((r)=>r.star);
          let totalReduced = total.reduce((p,n)=>p+n , 0);
          let highest = length * 5;
          let result = totalReduced * 5 / highest ;
          //these logs are rerendering infinitely i dont know why
        //   console.log("length",length);
        //   console.log("total reduced",totalReduced);
        //   console.log("highest ",highest);
        //   console.log("result",result);

          return (<div className="text-center pt-1 pb-3">
             <span>
                <StarRatings 
                   starDimension="20px"
                   starSpacing="2px"
                   starRatedColor="red"
                    rating={result}
                    editing={false}
                />{" "}
                ({p.ratings.length})
             </span>
          </div>);
      }
};