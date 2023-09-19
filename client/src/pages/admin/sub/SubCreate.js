import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { createSub,getSub,removeSub,getSubs } from "../../../functions/sub";
import { Link } from "react-router-dom";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { getCategories } from "../../../functions/category";

const SubCreate = () =>{

   
    const {user} =useSelector((state)=>({...state}));//destructuring the state object by spreading it and getting user out of that
    const [name,setName]=useState("");
    const [loading,setLoading]=useState(false);
    const [categories,setCategories]=useState([]);
    const [category,setCategory] = useState("");//parent category
    const [keyword,setKeyword] = useState("");
    const [subs,setSubs] = useState([]);
    //we use useEffect to show all the categories (list all categories) when the component mounts
    useEffect(()=>{
          loadCategories();
          loadSubs();
    },[]);
      
    const loadCategories = ()=>(getCategories().then((c)=>setCategories(c.data)));
    
    const loadSubs = ()=>(getSubs().then((s)=>setSubs(s.data)));

   const handleSubmit = (e)=>{
    e.preventDefault();
    //console.log(name);
    setLoading(true);
    createSub({name , parent:category},user.token)
    .then(res => {
      console.log(res);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is created`);
      loadSubs();
    })
    .catch(err =>{
      console.log(err);
      setLoading(false);
      //we are sending the error messag from backend as status code in controllers/category.js 
      if(err.response.status === 400)toast.error(err.response.data);
    });
   };

   const handleRemove = async (slug)=>{
        if(window.confirm("Are you sure you want to delete")){
          setLoading(true);
          removeSub(slug,user.token)
          .then(res=>{
            setLoading(false);
            toast.error(`${res.data.name} deleted`);
            loadSubs();
          })
          .catch(err=>{
            setLoading(false);
            if(err.response.status === 400){
              toast.error(err.response.data);
              setLoading(false);
            };
          })
        }
   }

  
const searched = (keyword) => (c)=> c.name.toLowerCase().includes(keyword) ;//we get c from categories array


    return( <div className="contianer-fluid"> 
    <div className="row">
    <div className="col-md-2">
    <AdminNav/>
    </div>
    <div className="col">
    {loading ?<h4 className="text-danger">Loading...</h4>:<h4>Create Sub Category</h4>}
    
    <div className="form-group">
    <label>Parent Category</label>
    <select name="category" className="form-control" onChange={ e => setCategory(e.target.value)}>
        <option>Please select parent</option>
       {categories.length > 0 && categories.map((c) => (
        <option key={c._id} value={c._id}>
        {c.name}
        </option>
       ))}
    </select>
    </div>



    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
    <br />
    <LocalSearch 
    keyword={keyword}
    setKeyword={setKeyword}
    />
    {subs.filter(searched(keyword)).map((s)=>(
         <div key={s._id} className="alert alert-secondary">
         {s.name} 
         <span onClick={()=>handleRemove(s.slug)} className="float-end btn btn-sm">
         <DeleteOutlined className="text-danger"/>
         </span> 
         <Link to={`/admin/sub/${s.slug}`}>
         <span className="float-end btn btn-sm"><EditOutlined className="text-warning"/></span>
         </Link>
         </div>
    ))}
    </div>
    </div>
    </div>);

};

export default SubCreate;