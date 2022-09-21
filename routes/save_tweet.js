const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');

router.post("/",async(req,res)=>{
  try {
    // const {twtUrl,st_id}=req.body
    const {twtUrl,st_id}=req.body


    const tweet_id=String(twtUrl.split('/').slice(-1))
    const tweet=await details.tweet(tweet_id)
    const user=await details.user(tweet.data[0]['author_id'])

    if(st_id){
      fetch("http://localhost:5000/createTweet",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          tweet:tweet,
          user:user
        })
      })
      .then(async response=>{
        const resp=await response.json()
      })
      .catch(err=>{
        console.log(err.message)
        res.send(err.message)
      })

      fetch('http://localhost:5000/firebase/getToken',{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          st_id:st_id,
        })
      })
      .then(res=>res.json())
      .then(results=>{
        const token=results.token
        console.log("token")
        fetch('http://localhost:5000/google/upload',{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({token:token,tweet_id:tweet_id})
        })
      })
      .catch(err=>{
        console.log(err.message)
        res.send(err.message)
      })
     
    }
    else{
      fetch('http://localhost:5000/firebase/new',{
        method:'GET',
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(result=>{
        const st_id=result.st_id
        console.log(st_id)
        const authorizationUrl=authUrl.genAuthUrl(tweet_id,st_id)
        if(tweet){
          res.json({authorizationUrl:authorizationUrl,st_id:st_id})

          fetch("http://localhost:5000/createTweet",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({
              tweet:tweet,
              user:user,
            })
          }).then(async response=>{
            const resp=await response.json()
          })
      
        }
      })
    }
  } catch (e) {
    res.status(400).json({"Error":e.mesage})
  }
})





module.exports = router;
