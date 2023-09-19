import React from "react";
import { Card,Skeleton } from "antd";


const LoadingCard = ({count}) => {

    const cards = ()=>{
      let totalCards=[];

      /*when we loop each item should contain unique key even in for loop not only for map */
      for(let i=0;i<count;i++){
        totalCards.push(<Card className="col-md-4 mb-3" key={i}>
             <Skeleton active ></Skeleton>
        </Card>
       
        );
      }
      return totalCards;
    };

    return (<div className="row pb-5">
        {cards()}
    </div>);
};


export default LoadingCard;