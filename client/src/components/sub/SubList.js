import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";

const SubList = ()=>{
      const [subs,setSubs] = useState([]);
      const [loading,setLoading] = useState(false);

      useEffect(()=>{
        setLoading(true);
        getSubs().then(res => {
              setLoading(false);
              setSubs(res.data);    
        });
      },[]);//without dependency array iam making infinite get requests to api/categories so include dependency array
      
      const showSubs = () => subs.map((s)=><div className="col btn btn-outline-primary btn-lg btn-block btn-raised  m-3" key={s._id}>
         <Link to={`/sub/${s.slug}`}>{s.name}</Link>
      </div>);

    return (<div className="container">
       <div className="row">
        {loading ? (<h4 className="text-danger text-center">Loading...</h4>) : showSubs()}
       </div>
    </div>); 
};

export default SubList;
