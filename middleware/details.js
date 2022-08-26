require('dotenv').config()
const fetch = require('node-fetch');




const tweet=async (id)=>{
  const url2=`https://api.twitter.com/2/tweets?ids=${id}&tweet.fields=attachments,author_id,public_metrics,entities,source,created_at&expansions=attachments.media_keys&media.fields=url,preview_image_url,height,width`
  const url=`https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at,attachments,author_id,public_metrics,source&media.fields=url`
  // const url=`https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at,attachments,author_id,public_metrics`
  try {
    const response=await fetch(url2,{
      method:'GET',
      headers:{
        "Authorization": `Bearer ${process.env.twitter_Token}`
      }
    })
    const resp=await response.json()

    const tweet={}

    tweet.data=resp['data']

    if (resp['includes']) {
      tweet.media=resp['includes']['media']
    }


    return tweet;
  } catch (e) {
    console.log(e.message);
  }

}

const user=async (id)=>{
  const url= `https://api.twitter.com/2/users/${id}?user.fields=name,username,location,verified,profile_image_url`
  try {
    const response=await fetch(url,{
      method:'GET',
      headers:{
        "Authorization": `Bearer ${process.env.twitter_Token}`
      }
    })

    const resp=await response.json()
    return resp.data
  } catch (e) {
    console.log(e.message);
  }

}




module.exports = {tweet,user};
