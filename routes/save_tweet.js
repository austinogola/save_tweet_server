const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');


//Template
router.post("/",async(req,res)=>{
  try {
    const {twtUrl}=req.body
    console.log(req.body);

    const tweet_id=String(twtUrl.split('/').slice(-1))
    // console.log(`${tweet_id}.../`);

    const tweet=await details.tweet(tweet_id)


    const user=await details.user(tweet.data['author_id'])


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

    res.json({"Status":"Done"})

  } catch (e) {
    console.log(e.message);
  }
})





module.exports = router;
