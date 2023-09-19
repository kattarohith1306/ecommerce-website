// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import firebase from "firebase/compat/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//only users registers thorugh this firebase account are stores in out data base not by the other two below
//this is from kattarohith.19je0428 account
const firebaseConfig = {
  apiKey: "AIzaSyBbz2vfhPx9Tmw8oSTreLJ7eCCC1urOWjk",
  authDomain: "ecommerce-456bc.firebaseapp.com",
  projectId: "ecommerce-456bc",
  storageBucket: "ecommerce-456bc.appspot.com",
  messagingSenderId: "1086831980002",
  appId: "1:1086831980002:web:99b4185a0cdd21575bddbb"
};

//dont use other firebase accounts when we access registered users in other firebase accounts
//this is from kannayyakatta account
// const firebaseConfig = {
//   apiKey: "AIzaSyApasDOEYYf-YRYYY7soY9atQ94-gZwJGU",
//   authDomain: "ecommerce-9296d.firebaseapp.com",
//   projectId: "ecommerce-9296d",
//   storageBucket: "ecommerce-9296d.appspot.com",
//   messagingSenderId: "1054942981570",
//   appId: "1:1054942981570:web:123d0cec7f8f3ab0007a5b"
// };

//this is from riverrafting account
// const firebaseConfig = {
//   apiKey: "AIzaSyBAJWdz7vM_bL-edtk0KnhMC9At4i3Jq68",
//   authDomain: "ecommerce-464c0.firebaseapp.com",
//   projectId: "ecommerce-464c0",
//   storageBucket: "ecommerce-464c0.appspot.com",
//   messagingSenderId: "1083809643215",
//   appId: "1:1083809643215:web:17dc6fe502b0ce244a15ba"
//};

// Initialize Firebase
const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const googleAuthProvide=new GoogleAuthProvider();

export {auth,googleAuthProvide};