import React from "react";
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { useSelector } from "react-redux";
import { Avatar,Badge } from "antd";


//uploading is onyl for admin so we get user token from redux store

const FileUpload = ({values,setValues,setLoading}) => {
      
    const {user} = useSelector((state) => ({...state}))

        const fileUploadAndResize = (e) => {
        //   console.log(e.target.files);
        //resize
          let files = e.target.files;
          let allUploadedFiles = values.images;//already exsisting files in intitial state of values
          if(files){
            setLoading(true);
            for(let i=0;i<files.length;++i){
               Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (uri)=>{
                    //    console.log(uri);
                    axios.post(`${process.env.REACT_APP_API}/uploadimages`,{image:uri},{
                        headers:{
                            authtoken:user ? user.token:"",
                        }
                    })
                    .then(res => {
                        console.log("IMAGE UPLOAD RES DATA",res);
                        setLoading(false);
                        allUploadedFiles.push(res.data);
                        setValues({...values,images:allUploadedFiles})
                    })
                    .catch(err=>{
                          setLoading(false);
                          console.log("CLOUDINARY UPLOAD ERROR",err);
                    });
                    },
                    "base64"
                );
            }
        }
        };
        const handleImageRemoval = (public_id) => {
             setLoading(true);
            // console.log("remove image",id);
            axios.post(`${process.env.REACT_APP_API}/removeimage`,{public_id},{
                headers:{
                    authtoken:user?user.token:"",
                },
            })
            .then(res=>{
                  setLoading(false);
                  const {images} = values;
                  let filteredImages = images.filter((item)=>{
                    return item.public_id!=public_id;
                  });
                  setValues({...values,images:filteredImages});
            })
            .catch(err=>{
                 setLoading(false);
                 console.log(err);
            });

        };

    return <>
       <div >
        {values.images && values.images.map((image)=> (
            <a key={image.public_id}  >
            <Badge count={'x'} style={{cursor:"pointer"}} onClick={()=>handleImageRemoval(image.public_id)}>
             <Avatar src={image.url} size={100} shape="square"  style={{ padding:10, marginHorizontal:5}}/>
             </Badge>
            </a>    
        ))}
       </div>
        <div>
       <label className="btn btn-primary">
       Choose File
       <input type="file" multiple accept="images/*" hidden onChange={fileUploadAndResize}/>
       </label>
    </div>
    </>
}

export default FileUpload;