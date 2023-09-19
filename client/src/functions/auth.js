
import axios from "axios";

export const createOrUpdateUser= async (authToken) => {
  return await axios.post(`${process.env.REACT_APP_API}/create-or-update-user`,{},{
     headers : {
        authToken,
     }
  });
};

//we send authtoken to endpoint where middleware check the user and gets the firebaseUser which contains {email,role,name,token,...} 
//this current user is used in App.js
export const currentUser= async (authToken) => {
    return await axios.post(`${process.env.REACT_APP_API}/current-user`,{},{
       headers : {
          authToken,
       }
    });
  };

  export const currentAdmin = async (authToken) => {
   return await axios.post(`${process.env.REACT_APP_API}/current-admin`,{},{
      headers : {
         authToken,
      }
   });
 };
