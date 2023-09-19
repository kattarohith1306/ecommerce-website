import React from "react";
import {Link} from "react-router-dom";


//where does these end points starts line are they created here in Link component itself or need some router assistance???
//ans:-there end points will be defined in App.js with Route component wrapping for navigation between pages.and app.js renders
//pages by using components that we have created based in the endpoints


//in Product admin can create new product
//in Products admin can see all products and there products have two buttons one for updata and one for delete.
//in Category we are going to do CRUD
const AdminNav = () => {
      return (<nav>
        <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/product" className="nav-link">Product</Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/products" className="nav-link">Products</Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/category" className="nav-link">Category</Link>
        </li>
        
        <li className="nav-item">
          <Link to="/admin/sub" className="nav-link">Sub Category</Link>
        </li>

        <li className="nav-item">
          <Link to="/admin/coupon" className="nav-link">Coupon</Link>
        </li>
        
        <li className="nav-item">
          <Link to="/user/password" className="nav-link">Password</Link>
        </li>

        </ul>
      </nav>);
};

export default AdminNav;