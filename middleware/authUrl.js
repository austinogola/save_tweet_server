const {google} = require('googleapis');
require('dotenv').config()


const genAuthUrl=(tweet_id,st_id)=>{
  const oauth2Client = new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    'http://localhost:5000/google/api'
  );

  const scopes=['https://www.googleapis.com/auth/photoslibrary.readonly','https://www.googleapis.com/auth/photoslibrary.appendonly']

  const authorizationUrl=oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
    state:`${tweet_id}.${st_id}`
  })

  return authorizationUrl
}


module.exports={genAuthUrl}
