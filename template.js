const templateStart=`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Tweet page</title>
    <script src="https://unpkg.com/feather-icons"></script>
    <style media="screen">
      blockquote.twitter-tweet {
        display: inline-block;
        font-family: "Helvetica Neue", Roboto, "Segoe UI", Calibri, sans-serif;
        font-size: 12px;
        font-weight: bold;
        line-height: 16px;
        border-color: #eee #ddd #bbb;
        border-radius: 5px;
        border-style: solid;
        border-width: 1px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        margin: 10px 5px;
        padding: 0 16px 16px 16px;
        min-width: 490px;
        max-width: 508px;
      }
      blockquote.twitter-tweet p {
        font-size: 18px;
        font-weight: 400;
        line-height: 22px;
        color: #0F1419;
      }
      blockquote.twitter-tweet a {
        color: #717F8A;
        font-weight: normal;
        text-decoration: none;
        outline: 0 none;
      }
      blockquote.twitter-tweet a:hover,blockquote.twitter-tweet a:focus {
        text-decoration: underline;
      }
      .avatar {
        vertical-align: middle;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 10px;
      }
      .profile{
        display: flex;
        margin-bottom: 16px;
      }
      #username{
        position: relative;
        top: 3px;
        font-size: 16px;
        line-height: 20px;
      }
      .mets{
        position: relative;
        bottom: 5px;
        border-bottom: 1px solid #CFD9DE;
        padding-bottom: 10px;
      }
      .mets a{
        color: #717F8A;
        font-weight: normal;
        font-size: 16px;
        text-decoration: none;
        outline: 0 none;
      }
      .stats{
        display: flex;
        width: 80%;
      }
      .stats a{
        color: #717F8A;
        font-weight: normal;
        font-size: 16px;
        text-decoration: none;
        outline: 0 none;
        margin: 3px;
        margin-right: 10px;
      }
      i{
        position: relative;
        top: 10px;
      }
    </style>
  </head>
  <body>
    </div>
    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">
      <div class="profile">`


const addImage=(imageUrl)=>{
  let html=`  <img src="${imageUrl}" alt="Avatar" class="avatar">`

  return html
}

const addUser=(name,username)=>{
  let html=`<div id="username"> ${name} <br/><a href="#">@${username}</a></div></div>`

  return html
}

const addText=(text)=>{
  let html=`<p>${text}</p>`

  return html
}


const addMets=(created_at,source)=>{


  // let html=`<div class="mets">
  //   <a href="#">12:00 PM June 11, 2022 from Nairobi, Kenya</a>
  // </div>`
  const mets=created_at.split('-')
  const year=mets[0]
  let time=mets[2].slice(3,8)
  parseInt(time.split(0,2))>=12?time+=' PM':time+=' AM'

  const month=getMonth(parseInt(mets[1]))

  const date=mets[2].slice(0,2)
  console.log(date);

  // const date=new Date(created_at)
  // console.log(date.getUTCHours()); // Hours
  // console.log(date.getUTCMinutes());
  // console.log(date.getUTCSeconds());
  // console.log(date.getUTCMonth())


  let html=`<div class="mets"><a href="#">${time} ${month} ${date}, ${year}	&#183; ${source} </a></div>`

  return html
}

// const getDate=(created_at)=>{
//   var months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//
//   let year=created_at[0:4]
//   let month=months[6]
//   let date=created_at[8:10]
// }
const getMonth=(n)=>{
  var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    return months[n-1]
}

const formatCounts=(count)=>{
  if (count>1000) {
    if (count>10000) {
      count=(parseInt(count)/1000).toFixed(1)
      count=count.toString()+'K'
      return count;
    }else {
      count=count.toLocaleString()
      return count;
    }
  }
  return count;
}
const addStats=(retweets,quotes,likes)=>{
  retweets=formatCounts(retweets)
  quotes=formatCounts(quotes)
  likes=formatCounts(likes)
  let html=`<div class="">
  <div class="stats">
      <a href="#">
        ${retweets} Retweets
      </a>
      <a href="#">
        ${quotes} Quote Tweets
      </a>
      <a href="#">
        ${likes} Likes
      </a>
    </div>
  </div>`

  return html
}

const templateEnd=`</blockquote>
<script>
feather.replace()
</script>
</body>
</html>`


module.exports = {templateStart,addImage,addUser,addText,addMets,addStats,templateEnd};
