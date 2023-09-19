import axios from "axios";

//this get method has corresponding get method in server side also
export const getCategories= async () =>   (await axios.get(`${process.env.REACT_APP_API}/categories`));
                    
export const getCategory= async (slug) =>  (await axios.get(`${process.env.REACT_APP_API}/category/${slug}`));

//this is accessed only by admin
export const removeCategory= async (slug,authtoken) =>   (await axios.delete(`${process.env.REACT_APP_API}/category/${slug}`,{
    headers :{
        authtoken,
    },
}) );

//second argument is updated category
export const updateCategory= async (slug,category,authtoken) =>   (await axios.put(`${process.env.REACT_APP_API}/category/${slug}`,category,{
    headers :{
        authtoken,
    },
}));

//we should send the category.
export const createCategory= async (category,authtoken) =>   (await axios.post(`${process.env.REACT_APP_API}/category`,category,{
    headers :{
        authtoken,
    },
}));


export const getCategorySubs = async (_id) =>  (await axios.get(`${process.env.REACT_APP_API}/category/subs/${_id}`));

