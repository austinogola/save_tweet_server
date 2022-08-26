const router=require("express").Router()
const fetch=require('node-fetch');
const fs = require('fs');
const template = require('../template');

router.post('/',async(req,res)=>{
  try {

    const tweet=req.body.tweet
    const user=req.body.user


    const starter=template.templateStart
    const image=template.addImage(user.profile_image_url)
    const userDetails=template.addUser(user.name,user.username)

    let text='',media='',mets='',stats=''
    if (tweet.media) {
      media=template.addMedia(tweet.media)
      // console.log(tweet.media);
    }

    text=template.addText(tweet.data[0].text)
    mets=template.addMets(tweet.data[0].created_at,tweet.data[0].source)
    const{retweet_count,quote_count,like_count}=tweet.data[0].public_metrics
    stats=template.addStats(retweet_count,quote_count,like_count)

    text=text.replace(/\n/g,'<br/>')

    // console.log(media,mets,stats);

    const end=template.templateEnd


    fs.writeFile(`${tweet.data[0].id}.html`,starter,async()=>{
      fs.appendFile(`${tweet.data[0].id}.html`,image,async()=>{
        fs.appendFile(`${tweet.data[0].id}.html`,userDetails,async()=>{
          fs.appendFile(`${tweet.data[0].id}.html`,text,async()=>{
            fs.appendFile(`${tweet.data[0].id}.html`,media,async()=>{
              fs.appendFile(`${tweet.data[0].id}.html`,mets,async()=>{
                fs.appendFile(`${tweet.data[0].id}.html`,stats,async()=>{
                  fs.appendFile(`${tweet.data[0].id}.html`,end,async()=>{
                    console.log('File created');
                  })
                })
              })
            })
          })
        })
      })
    })

    try {
      fetch(`http://localhost:5000/screenshot/shot`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name:tweet.data[0].id
        })
      }).then(async response=>{
        const resp=await response.json()
        res.send(resp)
      })
    }
    catch (e) {
      console.log(e.message);
      res.send(e.message)
    }


  } catch (e) {
    console.log(e.message);
  }
})






module.exports = router;
