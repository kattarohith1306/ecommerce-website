import React,{useState,useEffect} from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { getProduct,updateProduct } from "../../../functions/product";

import { getCategories,getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";


const initialState = {
    title:"",
    description:"",
    price: "",
  
    category:"",
    subs:[],
    shipping:"",
    quantity:"",
    images:[],
    colors:["Black","Brown","Silver","White","Blue"],
    brands:["Apple","Samsung","Microsoft","Lenovo","ASUS"],
    color:"",
    brand:"",
  
  };

const ProductUpdate = ()=>{
    
    const [values,setValues] = useState(initialState);
    const [categories,setCategories]= useState([]);
    const [subOptions,setSubOptions] = useState([]);
    const [arrayOfSubIds,setArrayOfSubIds] = useState([]);
    const [selectedCategory,setSelectedCategory]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate = useNavigate();
    const {user} = useSelector( state => ({...state}));
    const {slug} = useParams();

    const loadProduct = () => {
        getProduct(slug)
        .then(p=>{
            //console.log(p);
            //load single product
            setValues({...values,...p.data});
            //load single product sub categories
            getCategorySubs(p.data.category._id)
            .then(res => {
                setSubOptions(res.data);//on first load we show default subs

            });

            //prepare array of sub ids to show as default sub values antd Select
            let arr=[];
            p.data.subs.map(s => {
                arr.push(s._id);
            });
            console.log("SUBS ARR",arr);
           setArrayOfSubIds((prev)=>arr);
        });
      };

    useEffect(()=>{
        loadProduct();
        loadCategories();
    },[]);

    const loadCategories = ()=>(getCategories().then((c)=>setCategories(c.data)));
   
    const handleSubmit  = (e) => {
          e.preventDefault();
          //in handleSubmit we going to make put request
          setLoading(true);
          values.subs = arrayOfSubIds;
          values.category = selectedCategory ? selectedCategory : values.category;

          updateProduct(slug,values,user.token)
          .then(res => {
            setLoading(false);
            toast.success(`${res.data.title} is updated`);
            navigate('/admin/products');
          }).catch(err=>{
            setLoading(false);
            console.log(err);
            toast.error(err.response.data.message);
          })

    };

    const handleChange = (e)=>{
      setValues({...values,[e.target.name]:e.target.value});
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log("CLICKED CATEGORY",e.target.value);
        setValues({...values,subs:[]});
        setSelectedCategory(e.target.value);
        getCategorySubs(e.target.value).then( res=>{
          console.log("SUB OPTIONS ON CATEGORY CLIKCED",res);
          setSubOptions(res.data);
        });
        console.log("EXISITING CATEGORY values.category" ,values.category );
        //if user clicks the originals category we show its subs stores in database
        if(values.category._id === e.target.value){
            loadProduct();
        }
        setArrayOfSubIds([]);

  
      };
      

    return (
        <div className="container-fluid">
           <div className="row">
           <div className="col-md-2">
           <AdminNav/>
           </div>


           <div className="col-md-10">
           <div className="col-md-10">
             {loading ? <LoadingOutlined className="text-danger h1"/> : <h4>Product update</h4>}
             
             </div>
           <hr/>
            {/* {JSON.stringify(values)} */}

            <div>
              <FileUpload values={values} setValues={setValues} setLoading={setLoading}/>
            </div>
            <br/>
            <ProductUpdateForm 
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                handleCategoryChange={handleCategoryChange}
                categories={categories}
                subOptions={subOptions}
                arrayOfSubIds={arrayOfSubIds}
                setArrayOfSubIds={setArrayOfSubIds}
                selectedCategory={selectedCategory}
            />
           </div>
           </div>
        </div>
    );
};


export default ProductUpdate;