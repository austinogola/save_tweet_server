// import { initializeApp } from "firebase/app";
const express = require('express');
const initializeApp=require('firebase/app').initializeApp
const { getFirestore,collection,getDocs }= require("@firebase/firestore");

const exApp=express()



// https://firebase.google.com/docs/web/setup#available-libraries

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8zpeBywSwEvyGDBxLr6C-bmw4KYFa5y4",
  authDomain: "tweet-shots.firebaseapp.com",
  databaseURL: "https://tweet-shots-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tweet-shots",
  storageBucket: "tweet-shots.appspot.com",
  messagingSenderId: "343235792270",
  appId: "1:343235792270:web:4ca134c996f1dc2117e8df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Init services
const db=getFirestore()

//collection ref
const collRef=collection(db,'users')

//get Data
getDocs(collRef)
.then((snapshot)=>{
    snapshot.docs.forEach(item=>{
      console.log(item.data())
    })
    
})


exApp.listen(5000,()=>{
  console.log('Server Running Good on Port 5000');
})



