import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingToRedirect = () => {

    const [count,setCount]=useState(5);
    let navigate=useNavigate();
    
    //when count changes this useEffect runs and when this useEffect runs when the count changes
    //so its a cyclic process untill count becomes zero
    useEffect(()=>{
         
        const interval=setInterval(()=>{
            setCount((currCount)=> --currCount);
        },1000);
        //redirect when count is 0
        count === 0 && navigate("/");
        //cleanup
        return ()=>clearInterval(interval);
    },[count]);

    return (
        <div className='container p-5 text-center'>
            <p>Redirecting you in {count} seconds</p>
        </div>
    );
};

export default LoadingToRedirect;

