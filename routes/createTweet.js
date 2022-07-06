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
    let text=template.addText(tweet.data.text)
    text=text.replace(/\n/g,'<br/>')
    const mets=template.addMets(tweet.data.created_at,tweet.data.source)
    const{retweet_count,quote_count,like_count}=tweet.data.public_metrics
    const stats=template.addStats(retweet_count,quote_count,like_count)
    const end=template.templateEnd


    fs.writeFile(`${tweet.data.id}.html`,starter,async()=>{
      fs.appendFile(`${tweet.data.id}.html`,image,async()=>{
        fs.appendFile(`${tweet.data.id}.html`,userDetails,async()=>{
          fs.appendFile(`${tweet.data.id}.html`,text,async()=>{
            fs.appendFile(`${tweet.data.id}.html`,mets,async()=>{
              fs.appendFile(`${tweet.data.id}.html`,stats,async()=>{
                fs.appendFile(`${tweet.data.id}.html`,end,async()=>{
                  console.log('File created');
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
          name:tweet.data.id
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
