const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');

router.post("/",async(req,res)=>{
  try {
    const {twtUrl,st_id}=req.body


    const tweet_id=String(twtUrl.split('/').slice(-1))
    
    const tweet=await details.tweet(tweet_id)
    const user=await details.user(tweet.data[0]['author_id'])

    if(st_id){
      let url= 'http://127.0.0.1/createTweet'
      // let url="http://localhost:5000/createTweet"
      fetch(url,{
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

      const url2= 'http://127.0.0.1/firebase/getToken'
      // const url2='http://localhost:5000/firebase/getToken'
      fetch(url2,{
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

        const url3='http://127.0.0.1/google/upload'
        // const url3='http://localhost:5000/google/upload'
        fetch(url3,{
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
      const url4='http://127.0.0.1/firebase/new'
      // const url4='http://localhost:5000/firebase/new'
      fetch(url4,{
        method:'GET',
        headers:{
          "Content-Type":"application/json"
        }
      })
      .then(res=>res.json())
      .then(result=>{
        const st_id=result.st_id
        const authorizationUrl=authUrl.genAuthUrl(tweet_id,st_id)
        if(tweet){
          res.json({authorizationUrl:authorizationUrl,st_id:st_id})
          
          const url5='http://127.0.0.1/createTweet'
          // const url5="http://localhost:5000/createTweet"
          fetch(url5,{
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
          .catch(err=>{
            res.send(err.message)
          })
      
        }
      })
      .catch(err=>{
        res.send(err.message)
      })
    }
  } catch (e) {
    res.status(400).json({"Error":e.message})
  }
})





module.exports = router;
