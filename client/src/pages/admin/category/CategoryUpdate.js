import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { updateCategory,getCategory } from "../../../functions/category";
import { useNavigate,useParams } from "react-router-dom";
import CategoryForm from "../../../components/forms/CategoryForm";

const CategoryUpdate = () =>{

    const navigate =  useNavigate();

  //without onChange we  cannot change the property value,whatever the name variable is assgined intitally it will be fixed in value 
    const {user} =useSelector((state)=>({...state}));//destructuring the state object by spreading it and getting user out of that
    const [name,setName]=useState("");
    const [loading,setLoading]=useState(false);
    let { slug } = useParams();
  
    const loadCategory = ()=>(getCategory(slug).then((c)=>setName(c.data.name)));
    //we use useEffect to show all the categories (list all categories) when the component mounts
    useEffect(()=>{
          loadCategory()
    },[]);
      
    
     
     //while admin creates category and presses submit,while it submits we show loading 

   const handleSubmit = (e)=>{
    e.preventDefault();
    //console.log(name);
    setLoading(true);
    updateCategory(slug,{name},user.token)
    .then(res => {
      console.log(res);
      setLoading(false);
      setName("");
      toast.success(`"${res.data.name}" is updated`);
      navigate("/admin/category");
    })
    .catch(err =>{
      console.log(err);
      setLoading(false);
      //we are sending the error messag from backend as status code in controllers/category.js 
      if(err.response.status === 400)toast.error(err.response.data);
    });
   };


     
      //here the input will be prepopulated by name that we are getting from database
    return( <div className="contianer-fluid"> 
    <div className="row">
    <div className="col-md-2">
    <AdminNav/>
    </div>
    <div className="col">
    {loading ?<h4 className="text-danger">Loading...</h4>:<h4>Update Category</h4>}    
    <CategoryForm 
    handleSubmit={handleSubmit} 
    name={name} 
    setName={setName}
    />
    <hr/>
    </div>
    </div>
    </div>);

};

export default CategoryUpdate;