import React, { useState } from "react";
import {Modal,Button} from "antd";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useNavigate,useParams} from "react-router-dom";

const RatingModal = ({children})=>{//we get this children props as we are wrappin this component around StarRatings component
   const { user } = useSelector((state) => ({...state}));
   const [modalVisible,setModalVisible]=useState(false);
  
   const navigate = useNavigate();
   let {slug} = useParams();//the name that we used in route parameters in app.js ,that is the name we access from params


   const handleModal = () => {
      if(user && user.token ){
        setModalVisible(true);
      }else{
        navigate('/login', { state: { from: `/product/${slug}` } });
      }
   };
    return (
        <>
        <div onClick={handleModal}>
          <StarOutlined className="text-danger"/><br/>
          {user ? "Leave Rating":"Login to leave rating"}
        </div>
        <Modal
        title="Leave your rating"
        centered
        open={modalVisible}
        onOk={()=>{
            setModalVisible(false);
            toast.success("Thanks for your review.It will appear soon")
            }}
        onCancel = {()=>setModalVisible(false)}
        >{children}</Modal>
        </>
    );
};

export default RatingModal;