import React from 'react';
import {Select,Space} from "antd";





const ProductCreateForm = ({handleSubmit,handleChange,values,handleCategoryChange,subOptions,showSub,setValues}) => {

    //destructure
    const {title,description,price,categories,category,subs,shipping,quantity,images,colors,brands,color,brand} = values;

    /*const options = [];
    instead of for loop i used map on suboptions directly
    for (let i = 0; i < subOptions.length; i++) {
      options.push({
        label:subOptions[i].name,
        value:subOptions[i]._id,
      });
    }*/



 return (
    <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text"
                  name="title"
                  className="form-control"
                  value={title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text"
                  name="description"
                  className="form-control"
                  value={description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input 
                  type="number"
                  name="price"
                  className="form-control"
                  value={price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Shipping</label>
                <select name="shipping" className="form-control" onChange={handleChange}>
                <option>Please select one</option>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={quantity}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Colors</label>
                <select name="color" className="form-control" onChange={handleChange}>
                <option>Please select one</option>
                {colors.map((c)=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Brands</label>
                <select name="brand" className="form-control" onChange={handleChange}>
                <option>Please select one</option>
                {brands.map((b)=><option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              
              <div className="form-group">
               <label>Category</label>
               <select name="category" className="form-control" onChange={handleCategoryChange}>
               <option>Please select one</option>
               {categories.length > 0 && categories.map((c) => (
               <option key={c._id} value={c._id}>
               {c.name}
               </option>
              ))}
              </select>
              </div>
              
              {showSub &&  <div>
                <label>Sub Categories</label>
                 <Select
                  size='large'
                  mode='multiple'
                  allowClear
                  style={{
                   width: '100%',
                  }}
                  placeholder="Please select"
                  defaultValue={[]}
                  onChange={value => setValues({...values,subs:value})}
                  value={subs}
                  options={subOptions.map((s)=>({label:s.name,value:s._id,key:s._id}))}
                 
                 />
              </div>}
              <br/>
              <button className="btn btn-outline-primary">Save</button>
             </form>
 );
};

export default ProductCreateForm;