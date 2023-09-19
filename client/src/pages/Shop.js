import React, { useState,useEffect } from "react";
import { getProductsByCount } from "../functions/product";
import {getCategories} from "../functions/category";
import {useSelector,useDispatch} from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import { fetchProductsByFilter } from "../functions/product";
import { Menu,Slider,Checkbox, Radio } from 'antd';
import { DollarOutlined,DownSquareOutlined, StarOutlined } from "@ant-design/icons";
import Star from "../components/forms/Star";
import { getSubs } from "../functions/sub";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  }; 
}



const Shop = () => {

      const [products,setProducts] = useState([]);
      const [loading,setLoading] = useState(false);
      const [price,setPrice] = useState([0,0]);
      const [categories,setCategories] = useState([]);
      let dispatch = useDispatch();
      let { search } = useSelector((state) => ({...state}));
      const [ok,setOk] = useState(false);
      const { text } = search; 
      const [categoryIds,setCategoryIds] = useState([]);
      const [star,setStar] = useState('');
      const [subs,setSubs] = useState([]);
      const [sub,setSub] = useState("");
      const [brands,setBrands] = useState(["Apple","Samsung","Microsoft","Lenovo","ASUS"]);
      const [brand,setBrand] = useState("");
      const [colors,setColors] = useState(["Black","Brown","Silver","White","Blue"]);
      const [color,setColor]=useState("");
      const [shipping,setShipping] = useState("");

      const handleSlider = (value) => {
            dispatch({
              type:"SEARCH_QUERY",
              payload:{text:""},
            });
            setCategoryIds([]);
            setStar('');
            setSub("");
            setBrand("");
            setColor("");
            setShipping("");
            //console.log(value);
            setPrice(value);
            setTimeout(() => {
              setOk(!ok);
            },300);
      };


     
 
   
      useEffect(()=>{
          loadAllProducts();
          //fetch categories
          getCategories().then(res => setCategories(res.data));
          //fetch subcategories
          getSubs().then(res => setSubs(res.data));
      },[]);


      const onClick = (e) => {
        console.log('click ', e);
      };

      //1st way of getting products ,load products by default on page load
      const loadAllProducts = () => {
        setLoading(true);
        getProductsByCount(12).then( p => {
            setProducts(p.data);
            setLoading(false);
        });
      };

      //2nd way of getting products is by user search input
      useEffect(()=>{
       const delayed = setTimeout(()=>{
        if(text.length == 0) loadAllProducts();//this conditions renders all products when user backspaces total text so we load 
                                               //all products
        fetchProducts({query:text});
       },300); 

       return ()=> clearTimeout(delayed);
      },[text]); 

      //we delay request to make less requests to avoid overhead
      const fetchProducts = (arg) => {
        setLoading(true);
        fetchProductsByFilter(arg)
        .then(res => {
            setLoading(false);
            setProducts(res.data);
        });
      };
    
      //3rd way load products based on price
      useEffect(()=>{
            console.log("ok to request");
            fetchProducts({price});
      },[ok]);



      const handleCheck = e => {
        //  console.log(e.target.value);
        dispatch({
          type:"SEARCH_QUERY",
          payload:{text:""},
        });
        setPrice([0,0]);
        setStar("");
        setSub("");
        setBrand("");
        setColor("");
        setShipping("");
        let inTheState = [...categoryIds];
        let justChecked = e.target.value; 
        let foundInTheState = inTheState.indexOf(justChecked);//returns index or -1

        if(foundInTheState === -1){
           inTheState.push(justChecked);
        }else{
          inTheState.splice(foundInTheState,1);
        }
        setCategoryIds(inTheState);
         console.log(inTheState);
        fetchProducts({category:inTheState});
      };

      //4.load products based on category
      //show categories in a list of check box
          const showCategories = () => categories.map((c) => getItem( <div> 
            <Checkbox onChange={handleCheck} value={c._id} checked={categoryIds.includes(c._id)} className="pl-2 pr-2">
            <div>{c.name}</div> 
            </Checkbox>
            <br/>
      </div> , c._id));
         
      //5.load products by star rating
      const handleStarCLick = (num) => {
          //  console.log(num);
          dispatch({
            type:"SEARCH_QUERY",
            payload:{text:""},
          });
          setPrice([0,0]);
          setCategoryIds([]);
          setSub("");
          setBrand("");
          setColor("");
          setShipping("");
          setStar(num);
          fetchProducts({stars:num});
      };
      
      //6 .load products based on subcategory
      const handleSub = s => {
        // console.log('SUB',s);
        setSub(s);
        dispatch({
          type:"SEARCH_QUERY",
          payload:{text:""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setBrand("");
        setColor("");
        setShipping("");
        fetchProducts({sub:s});
      };
      const showSubs = () => subs.map((s) => getItem(<div 
      className="badge badge-secondary" 
      onClick={() => handleSub(s)}
      style={{cursor:"pointer"}}
      >
        {s.name}
      </div>, s._id));
    
      //7.load products based on brand
      const handleBrand = (e) => {
        dispatch({
          type:"SEARCH_QUERY",
          payload:{text:""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setSub("");
        setBrand(e.target.value);
        setColor("");
        setShipping("");
        fetchProducts({brand:e.target.value});
      }
      
      const showBrands = () => brands.map((b) => getItem(
        <Radio 
        value={b} 
        name={b} 
        checked = {b === brand} 
        onChange={handleBrand}
        >{b}</Radio>,b));


      //8.load based on color
      const handleColor = (e) => {
        dispatch({
          type:"SEARCH_QUERY",
          payload:{text:""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setStar('');
        setSub("");
        setBrand("");
        setShipping("");
        setColor(e.target.value);
        fetchProducts({color:e.target.value});
      }
      const showColors = () => colors.map( (c) => getItem(
          <Radio
          value={c}
          name={c}
          checked= {c == color}
          onChange={handleColor}
          >
            {c}
          </Radio>,c));

    //9.load based in Shipping
     const handleShippingChange = (e) => {
      dispatch({
        type:"SEARCH_QUERY",
        payload:{text:""},
      });
      setPrice([0,0]);
      setCategoryIds([]);
      setStar('');
      setSub("");
      setBrand("");
      setColor("");
      setShipping(e.target.value);
      fetchProducts({shipping:e.target.value});
     };


     //array of options for Menu
      const formatter = (value) => `$${value}`;
      const items = [
      getItem('Price', '1', <DollarOutlined /> , [
     getItem( <div > <Slider 
                      max={4999} 
                      range value={price} 
                      tooltip={{ formatter }} 
                      onChange={handleSlider}
                      /></div>, 'price'),
      ]),
      getItem('Categories', '2', <DownSquareOutlined />  ,showCategories()),//showCategories returns an array as getItems accepts only array as 4rth argument
      getItem('Rating', '3', <StarOutlined />  , [
      getItem(<div>
          <Star 
           starClick = {handleStarCLick}
           numberOfStars={5}//click exactly on the stars to work
          />
        </div>,
        ),
        getItem(<div>
          <Star 
           starClick = {handleStarCLick}
           numberOfStars={4}//click exactly on the stars to work
          />
        </div>,
        ),
        getItem(<div>
          <Star 
           starClick = {handleStarCLick}
           numberOfStars={3}//click exactly on the stars to work
          />
        </div>,
        ),getItem(<div>
        <Star 
         starClick = {handleStarCLick}
         numberOfStars={2}//click exactly on the stars to work
        />
      </div>,
      ),getItem(<div>
      <Star 
       starClick = {handleStarCLick}
       numberOfStars={1}//click exactly on the stars to work
      />
    </div>,
    )]
      ),
      getItem('Sub Categories', '4', <DownSquareOutlined /> ,showSubs()),
      getItem('Brands', '5', <DownSquareOutlined /> ,showBrands()),
      getItem('Colors', '6', <DownSquareOutlined /> ,showColors()),
      getItem('Shipping', '7', <DownSquareOutlined /> ,[
        getItem(<Checkbox onChange={handleShippingChange} value="Yes" checked = {shipping === "Yes"} >Yes</Checkbox>
     ,"yes"),
        getItem(<Checkbox onChange={handleShippingChange} value="No" checked = {shipping === "No"} > No </Checkbox> ,"no")
      ]),
     ];

      return (
        <div className="container-fluid">
           <div className="row ">
              <div className="col-md-3 pt-2">
                <h4 className="text-dark">Search/Filter</h4>
               <hr/>
                <Menu
                  onClick={onClick}
                  style={{
                  width: 360,
                   }}
                  // defaultSelectedKeys={['1']}
                  defaultOpenKeys={['1','2']}//this by default opens the box when this page loads
                  mode="inline"
                  items={items}
                  className="text-dark h6"
               />
              </div>

              <div className="col-md-9 pt-2">
                {loading ? (
                    <h4 className="text-danger">Loading...</h4>
                ): (
                    <h2 className="text-dark">Products</h2>
                )}
                {products.length < 1 && <p>No products found</p>} 
                
                <div className="row">
                    {products.map( p => (
                        <div className="col-md-4 mt-4" key={p._id}>
                              <ProductCard product={p} />
                        </div>
                    ))}
                </div>
              </div>
           </div>
        </div>
      );
    
};

export default Shop;