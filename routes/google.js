const router = require('express').Router();
const fetch=require('node-fetch');
const path = require('path');
const {google} = require('googleapis');
require('dotenv').config()
const fs = require('fs');

router.post('/api',async(req,res)=>{

})

router.get('/api',async(req,res)=>{
  if(req.query.code){
    let code=req.query.code
    let state=req.query.state
    const tweet_id=state.split('.')[0]
    const st_id=state.split('.')[1]

    // let url1='https://oauth2.googleapis.com/token'

    fetch('http://localhost:5000/google/token',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({code:code,tweet_id:tweet_id,st_id:st_id})

    })
  }
  res.sendFile(path.join(__dirname,"auth.html"))
})


router.post("/token",async(req,res)=>{
  const {code,tweet_id,st_id}=req.body

  let url = new URL("https://oauth2.googleapis.com/token")
  let params = {
    client_id:process.env.client_id,
    client_secret:process.env.client_secret,
    code:code,
    redirect_uri:'http://localhost:5000/google/api',
    grant_type:'authorization_code'
  }

  Object.keys(params).forEach(key=>{
    url.searchParams.append(key, params[key])
  })

  fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
  })
  .then(res=>res.json())
  .then(async result=>{
    let token=await result.access_token
    fetch('http://localhost:5000/firebase/update',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({st_id:st_id,token:token})
    })

    fetch('http://localhost:5000/google/upload',{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({token:token,tweet_id:tweet_id})
    })
  })
})

router.post('/upload',async(req,res)=>{
  const {token,tweet_id}=req.body
  // let fileExists=fs.existsSync(`../server/${tweet_id}.png`)

  await fetch(`http://localhost:5000/screenshot/shot`,{
    method:'POST',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      name:tweet_id,
      // st_id:st_id
    })
  }).then(async response=>{
    const resp=await response.json()
    res.send(resp)
  })

  const file=fs.readFileSync(`../server/${tweet_id}.png`, 'binary')
  const photo=Buffer.from(file,'binary')

  try{
    fs.unlinkSync(`../server/${tweet_id}.png`)
    fs.unlinkSync(`../server/${tweet_id}.html`)
  }catch(err){
    console.log(err.message);
  }

  // res.send(photo

  //list albums
  var query = new URLSearchParams();
  query.append("excludeNonAppCreatedData", "true");
  const paramss={pageSize:20,excludeNonAppCreatedData:true}
  const uvv='https://photoslibrary.googleapis.com/v1/albums?'+query.toString()
  fetch(uvv,{
    method:'GET',
    headers:{
      'Content-type':'application',
      'Authorization':`Bearer ${token}`
    }
  }).then(async result=>{
    response=await result.json()
    const allAlbums=response.albums
    let albumExist=false
    let albumId='SSSS'
    allAlbums.forEach(album=>{
      if (album.title=='Save Tweets') {
        albumExist=true
        albumId=album.id
      }
    })
    if(albumExist){
      //Upload
      fetch('https://photoslibrary.googleapis.com/v1/uploads',{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-type':'application/octet-stream',
          'X-Goog-Upload-Content-Type':'image/png',
          'X-Goog-Upload-Protocol':'raw'
        },
        body:photo
      }).then(async result=>{
        let upload_token=await result.text()
        //batchCreate
        fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',{
          method:"POST",
          headers:{
            'Content-type':'application/json',
            'Authorization':`Bearer ${token}`
          },
          body:JSON.stringify(
            {
              "albumId": albumId,
              "newMediaItems":[{
                "description":"ffff vibsiu",
                "simpleMediaItem":{
                  "fileName":"ffuivwi",
                  "upload_token":upload_token
                }
              }]
            }
          )
        }).then(result=>result.json()).then(data=>{
          const status=data.newMediaItemResults[0].status
          console.log(status);
        })

      })
    }else{
      //Create the album
      fetch('https://photoslibrary.googleapis.com/v1/albums',{
        method:'POST',
        headers:{
          'Content-type':'application/json',
          'Authorization':`Bearer ${token}`
        },
        body:JSON.stringify({"album":{"title":"Save Tweets"}})
      }).then(async result=>{
        newAlbum=await result.json()
        let albumId=newAlbum.id
        //Upload
        fetch('https://photoslibrary.googleapis.com/v1/uploads',{
          method:'POST',
          headers:{
            'Authorization':`Bearer ${token}`,
            'Content-type':'application/octet-stream',
            'X-Goog-Upload-Content-Type':'image/png',
            'X-Goog-Upload-Protocol':'raw'
          },
          body:photo
        }).then(async result=>{
          let upload_token=await result.text()
          //batchCreate
          fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',{
            method:"POST",
            headers:{
              'Content-type':'application/json',
              'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify(
              {
                "albumId": albumId,
                "newMediaItems":[{
                  "description":"ffff vibsiu",
                  "simpleMediaItem":{
                    "fileName":"ffuivwi",
                    "upload_token":upload_token
                  }
                }]
              }
            )
          }).then(result=>result.json()).then(data=>{
            const status=data.newMediaItemResults[0].status
            console.log(status);
          })

        })
      })

    }
  })
  // fetch('https://photoslibrary.googleapis.com/v1/uploads',{
  //   method:"POST",
  //   headers:{
  //     'Authorization':`Bearer ${token}`,
  //     'Content-type':'application/octet-stream',
  //     'X-Goog-Upload-Content-Type':'image/png',
  //     'X-Goog-Upload-Protocol':'raw'
  //   },
  //   body:{data:photo}
  // }).then(async result=>{
  //   //create album
  //   let upload_token=await result.text()
  //   let album_id='save_tweet'
  //   fetch('https://photoslibrary.googleapis.com/v1/albums',{
  //     method:'POST',
  //     headers:{
  //       'Content-type':'application/json',
  //       'Authorization':`Bearer ${token}`
  //     },
  //     body:{"album":{"title":"save tweets"}}
  //   })
  // }).then(async result=>{
  //   response=await result.json()
  //   console.log(response);
  // })

  // fs.readFile('../server/1569137792927531013.png' ,{ flag: "r" }, (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return
  //   }
  //   fetch('https://photoslibrary.googleapis.com/v1/uploads',{
  //     method:"POST",
  //     headers:{
  //       'Authorization':`Bearer ${token}`,
  //       'Content-type':'application/octet-stream',
  //       'X-Goog-Upload-Content-Type':'image/png',
  //       'X-Goog-Upload-Protocol':'raw'
  //     },
  //     body:{data:photo}
  //   }).then(async result=>{
  //     let upload_token=await result.text()
  //     let album_id='save_tweet'
  //     fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate`,{
  //       method:"POST",
  //       headers:{
  //         'Authorization':`Bearer ${token}`,
  //         'Content-type':'application/json',
  //       },
  //       body:JSON.stringify({
  //         "newMediaItems":[
  //           {
  //           'description':"New tweet",
  //           "simpleMediaItem":{
  //             "uploadToken":upload_token,
  //             "fileName":'firstItem2'
  //           }
  //         }
  //       ]
  //       })
  //     }).then(async result=>{
  //       repp=await result.json()
  //       console.log(repp.newMediaItemResults);
  //       res.send('Done')
  //     })
  //   })
  // });
})//GGGGGGG


// {
//   access_token: 'ya29.a0AVA9y1uK-fjYq2YNDgYejLfr36NP5CTLMKgIKII8ftunc-CWCZKm5w0PhE9pf4G12GDAuDD9cvYanbwAGPrPtpTGQHcOr_V-05zpNz6uPgcx5kht73Z87BVSB2wHZ5AfmqKornckgBBMGsY-89E6yuCpS-eHaCgYKATASAQASFQE65dr8xON7BoJu7LTKWF4Ov7ltjQ0163',
//   expires_in: 3599,
//   refresh_token: '1//03vTaX9FBJDanCgYIARAAGAMSNwF-L9IrtJEu7yIw5Um4wmK_6jAgxm6GE3AAwfMxBPCA7YfrmS3pNe6ORbpiPvt-83hNYKTs5gw',
//   scope: 'https://www.googleapis.com/auth/photoslibrary.appendonly',
//   token_type: 'Bearer'
// }




module.exports = router;
