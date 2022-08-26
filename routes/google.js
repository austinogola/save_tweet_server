const router = require('express').Router();
const fetch=require('node-fetch');
const {google} = require('googleapis');
require('dotenv').config()

router.get('/',(req,res)=>{

})



router.post('/api',async(req,res)=>{

})

router.get('/api',async(req,res)=>{
  res.send("Working 1")
})

router.get('/api:id',async(req,res)=>{
  console.log(req.params.id);
  res.send("Working 2")
})

router.get('/test',async(req,res)=>{
  const oauth2Client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    'http://localhost:5000/google/api'
  );

  const scopes=['https://www.googleapis.com/auth/photoslibrary.appendonly']

  const authorizationUrl=oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  })

  console.log(authorizationUrl);
})




module.exports = router;
