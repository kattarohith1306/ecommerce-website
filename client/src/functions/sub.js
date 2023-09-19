import axios from "axios";

//this get method has corresponding get method in server side also
export const getSubs= async () =>   (await axios.get(`${process.env.REACT_APP_API}/subs`));
                    
export const getSub= async (slug) =>  (await axios.get(`${process.env.REACT_APP_API}/sub/${slug}`));

//this is accessed only by admin
export const removeSub= async (slug,authtoken) =>   (await axios.delete(`${process.env.REACT_APP_API}/sub/${slug}`,{
    headers :{
        authtoken,
    },
}));

//second argument is updated category
export const updateSub= async (slug,sub,authtoken) =>   (await axios.put(`${process.env.REACT_APP_API}/sub/${slug}`,sub,{
    headers :{
        authtoken,
    },
}));

//we should send the category.
export const createSub= async (sub,authtoken) =>   (await axios.post(`${process.env.REACT_APP_API}/sub`,sub,{
    headers :{
        authtoken,
    },
}));


