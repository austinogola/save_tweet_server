const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');


//Template
router.post("/",async(req,res)=>{
  try {
    // const {twtUrl,st_id}=req.body
    const {twtUrl}=req.body


    const tweet_id=String(twtUrl.split('/').slice(-1))
    
    const authorizationUrl=authUrl.genAuthUrl(tweet_id)


    const tweet=await details.tweet(tweet_id)

    let user=''
    if (tweet.media) {
      user=await details.user(tweet.data[0]['author_id'])

    }else {
      console.log('No media');
      user=await details.user(tweet.data[0]['author_id'])

    }

  fetch("http://localhost:5000/createTweet",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        tweet:tweet,
        user:user,
        // st_id:st_id
      })
    }).then(async response=>{
      const resp=await response.json()
      console.log(resp);
    })

    res.json({Status:"Done",authorizationUrl:authorizationUrl})

  } catch (e) {
    console.log(e.message);
  }
})





module.exports = router;
