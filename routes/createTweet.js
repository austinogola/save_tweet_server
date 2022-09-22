const router=require("express").Router()
const fetch=require('node-fetch');
const fs = require('fs');
const template = require('../template');

router.post('/',async(req,res)=>{
  try {
    const {tweet,user,st_id}=req.body

    const starter=template.templateStart
    const image=template.addImage(user.profile_image_url)
    const userDetails=template.addUser(user.name,user.username,user.verified)

    let text='',media='',mets='',stats=''
    if (tweet.media) {
      media=template.addMedia(tweet.media)
    }

    const entities=tweet.data[0].entities?tweet.data[0].entities:{}
    text=template.addText(tweet.data[0].text,entities)
    mets=template.addMets(tweet.data[0].created_at,tweet.data[0].source)
    const{retweet_count,quote_count,like_count}=tweet.data[0].public_metrics
    stats=template.addStats(retweet_count,quote_count,like_count)

    text=text.replace(/\n/g,'<br/>')



    const end=template.templateEnd


    fs.writeFile(`${tweet.data[0].id}.html`,starter,async()=>{
      fs.appendFile(`${tweet.data[0].id}.html`,image,async()=>{
        fs.appendFile(`${tweet.data[0].id}.html`,userDetails,async()=>{
          fs.appendFile(`${tweet.data[0].id}.html`,text,async()=>{
            fs.appendFile(`${tweet.data[0].id}.html`,media,async()=>{
              fs.appendFile(`${tweet.data[0].id}.html`,mets,async()=>{
                fs.appendFile(`${tweet.data[0].id}.html`,stats,async()=>{
                  fs.appendFile(`${tweet.data[0].id}.html`,end,async()=>{
                    res.status(200).json({"Status":"File created"})
                  })
                })
              })
            })
          })
        })
      })
    })


  } catch (e) {
    console.log(e.message);
  }
})






module.exports = router;
