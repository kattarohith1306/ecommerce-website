import React from "react";
import {CheckCircleOutlined,CloseCircleOutlined} from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo"; 

const Orders = ({orders,handleStatusChange}) => {
    


    const showOrderInTable = (order) => (
        <table className="table table-bordered ">
          <thead className="table-secondary">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Quantity</th>
            <th scope="col">Shipping</th>
           </tr> 
          </thead>
        <tbody>
            {order.products.map((p,i) => (
                <tr key={i}>
                     <td><b>{p.product.title}</b></td>
                     <td>{p.product.price}/-</td>
                     <td>{p.product.brand}</td>
                     <td>{p.color}</td>{/*user chosen color not the product color */}
                     <td>{p.count}</td>
                     <td>{p.product.shipping === "Yes" ? <CheckCircleOutlined style={{color:"green"}}/> 

                     : <CloseCircleOutlined style={{color:"red"}}/>}
                     </td>
                </tr>
            ))}
        </tbody>    
        </table>
    );
    //when i reload the default={order.orderStatus} is still showing not processed even after admin have changed the status
    //might be because after changing statis we have to fetch again orders freshly ,but orders are getting from parent'
    //component so we are not able to fetch the products
    //but dont worry even if admin cant see in app he can see in database and also user dashboard gets updated with the status
    //with the admin changed status so we can inform the status of the order to user
    return <>
        {orders.map((order) => (
            <div key={order._id} className="row pb-5">
            <div className="btn btn-block btn-lg bg-secondary bg-gradient text-dark">
            <ShowPaymentInfo order={order} showStatus={false}/>
              <div className="row">
                <div className="col-md-4"><p className="float-end">Delivery Status</p></div>
                <div className="col-md-8">
                    <select default={order.orderStatus} className="float-left" onChange={e => handleStatusChange(order._id,e.target.value)}>
                        <option value="Not Processed">Not Processed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Processing">Processing</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Complete</option>
                        <option value="Cash On Delivery">Cash On Delivery</option>
                    </select>
                </div>
              </div>
            </div>
            {showOrderInTable(order)}
            </div>
        ))}
    </>
};

export default Orders;