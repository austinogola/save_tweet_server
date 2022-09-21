const router = require('express').Router();

const express = require('express');
const initializeApp=require('firebase/app').initializeApp
const { getFirestore,collection,doc,getDoc,addDoc,updateDoc }= require("@firebase/firestore");

const exApp=express()

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

  const app = initializeApp(firebaseConfig);

  //Init services
  const db=getFirestore()
  
  //collection ref
  const collRef=collection(db,'users')

  router.get('/new',async(req,res)=>{
    const docRef=await addDoc(collRef,{})
    const st_id=await docRef.id
    res.json({st_id:st_id})
  })

  router.post('/getToken',async(req,res)=>{
    const {st_id}=req.body
    const docRef=await doc(db,'users',st_id)
    const docSnap=await getDoc(docRef)

    const token=docSnap.data().token

    res.json({token:token})
    
  })

  router.post('/update',async(req,res)=>{
    const {st_id,token}=req.body
    const docRef=await doc(db,'users',st_id)

    updateDoc(docRef,{token:token})
    console.log("Updated")
  })


  module.exports = router;