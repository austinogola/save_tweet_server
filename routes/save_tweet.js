const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');


//Template
router.post("/",async(req,res)=>{
  try {
    const {twtUrl}=req.body
    console.log(req.body);

    const tweet_id=String(twtUrl.split('/').slice(-1))


    const tweet=await details.tweet(tweet_id)

    const authorizationUrl=authUrl.genAuthUrl()

    let user=''
    if (tweet.media) {
      console.log('Media');
      user=await details.user(tweet.data[0]['author_id'])
    }else {
      console.log('No media');
      user=await details.user(tweet.data[0]['author_id'])
    }



    const response=fetch("http://localhost:5000/createTweet",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        tweet:tweet,
        user:user
      })
    })

    res.json({Status:"Done",authorizationUrl:authorizationUrl})

  } catch (e) {
    console.log(e.message);
  }
})





module.exports = router;
