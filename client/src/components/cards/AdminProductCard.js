import React from "react";
import {Card} from 'antd';
import laptop from "../../images/laptop.jpg"
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const {Meta} = Card;

const AdminProductCard = ({product,handleRemove})=>{

    const {title,description,images,slug} = product
     return (
//     <Card
//     hoverable
//     
//     cover={<img
        
//        alt="example" 
//        src={images&&images.length ? images[0].url:""} 
//        style={{
//          height:"150px",
//          objectFit:"cover",
//          className:"p-1"
//        }}
       
//        />}
//   >
//     <Meta title={title} description={description} />
//   </Card>


 <Card
hoverable
className="m-2" 
cover={<img style={{height:"250px",objectFit:"cover"}} src={images && images.length ? images[0].url:laptop} />}
actions={[
    <Link to={`/admin/product/${slug}`}>
    <EditOutlined className="text-warning"/>
    </Link>,
    <DeleteOutlined onClick={() => handleRemove(slug)} className="text-danger"/>
]}
>
<Meta title={title} description={`${description&&description.substring(0,35)}...`} />
</Card>

     );
};

export default AdminProductCard;