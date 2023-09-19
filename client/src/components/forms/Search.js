import React from "react";
import {useNavigate} from "react-router-dom";
import {useSelector,useDispatch} from "react-redux";
import {SearchOutlined } from "@ant-design/icons";


const Search = () => {
 
   const dispatch = useDispatch();
   const {search} = useSelector((state)=>({...state}));
   const { text } = search;
   const navigate = useNavigate();
  
   const handleChange = (e) => {
     dispatch({
        type:"SEARCH_QUERY",
        payload:{text:e.target.value}
     });
   };

   const handleSubmit = (e) => {
       e.preventDefault();
       navigate(`/shop?${text}`);
   };
   
   //use might press enter after typing or press on search icon,both the times we execute handleSubmit function

   return (
    <form className="form-inline my-lg-0" onSubmit={handleSubmit}> 
   
    {/* <div class="form-group mx-sm-3 mb-2">
    <label for="inputPassword2" class="sr-only">Search</label>
    <input type="search" class="form-control"  placeholder="Search" value={text} onChange={handleChange} />
    
  </div> */}
       <input 
       type="search" 
       value={text} 
      className=" mx-sm-3" 
       placeholder="Search"
       onChange={handleChange} 
       /> 
   <SearchOutlined onClick={handleSubmit} style={{ cursor : "pointer"}} />
    </form>
   );

};

export default Search;