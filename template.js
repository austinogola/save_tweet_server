const templateStart=`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Tweet page</title>
    <script src="https://unpkg.com/feather-icons"></script>
    <style media="screen">
      .wrapperGG{
        max-width:740px;
        display:flex;
        justify-content:center;
        padding:10px;
      }
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
        width: 100%;
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
      span{
        color:#34A5F2;
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
    <div class="wrapperGG">
      <blockquote class="twitter-tweet"><p lang="en" dir="ltr">
        <div class="profile">`


const addImage=(imageUrl)=>{
  let html=`
    <img src="${imageUrl}" alt="Avatar" class="avatar">`

  return html
}

const addUser=(name,username,verified)=>{
  let html=`<div id="username"> ${name}  `

  if(verified){
    html+=`<img src="https://i.postimg.cc/63ngHVjT/verified-badge-16.png" style='position:relative;top:3px;'alt="verified">`
  }
  html+=`<br/>
  <a href="#">@${username}</a>
  </div>
  </div>`

  return html
}

const formEntities=(obj)=>{
  let blues=[]

  if (obj.mentions) {
    obj.mentions.forEach(mention=>{
      blues.push(`@${mention.username}`)
    })
  }

  if(obj.hashtags){
    obj.hashtags.forEach(hashtag=>{
      blues.push(`#${hashtag.tag}`)
    })
  }
  return blues
}

const addText=(text,entities)=>{
  text=text.split(' ')
  if(text[text.length-1].includes('https://t')){
    text.pop()
  }
  const blues=formEntities(entities)

  text.forEach(word=>{
    blues.forEach(blue=>{
      if (word.includes(blue)){
        let newWord=word.replace(blue,`<span>${blue}</span>`)
        const wordIndex=text.indexOf(word)
        text.splice(wordIndex,1,newWord)

      }
    })
  })

  text=text.join(' ')
  let html=`<p>${text}</p>`

  return html
}


const addMets=(created_at,source)=>{


  // let html=`<div class="mets">
  //   <a href="#">12:00 PM June 11, 2022 from Nairobi, Kenya</a>
  // </div>`

  var d=new Date(created_at)
  // console.log(d.toString());
  const year=d.getFullYear()
  const month=getMonth(d.getMonth())
  const date=d.getDate()
  const minutes=d.getMinutes()>10?d.getMinutes():`0${d.getMinutes()}`
  const hours=d.getHours()>12?d.getHours()-12:d.getHours()
  let time=d.getHours()>12?`${hours}:${minutes} PM`:`${hours}:${minutes} AM`



  // parseInt(time.split(':'))>=12?time+=' PM':time+=' AM'

  let html=`<div class="mets"><a href="#">${time} &#183; ${month} ${date}, ${year}	&#183; ${source} </a></div>`

  return html
}


const getMonth=(n)=>{
  var months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    return months[n]
}

const addMedia=(media)=>{
  if(media[0].type=='video'){
    let html=`<div class="media" style="height:480px;margin-bottom:15px;border:1px solid #CFD9DE;border-radius:15px;overflow:hidden;background-image:url('${media[0].preview_image_url}');background-size:cover;background-position:center;background-repeat:no-repeat;">
      <!--<img src="${media[0].preview_image_url}" alt="" style="width:100%;max-height:100%">-->
    </div>`

    return html

  }else{
    if (media.length==1) {
      let html=`
      <div class="media" style="height:480px;border:1px solid #CFD9DE;border-radius:15px;overflow:hidden;background-image:url('${media[0].url}');background-size:cover;background-position:center;background-repeat:no-repeat;margin-bottom:15px;">
        <!--<img src="${media[0].url}" alt="" style="max-width:100%;max-height:100%">-->
      </div>
      `

      return html
    }
    if (media.length%2==0) {
      let rmved=`<img src="" alt="" style="max-width:100%;height:100%">
      <div style="display:flex;justify-content:center;margin-bottom:15px;">`

      let html=`
      <div class="media" style="height:480px;margin-bottom:15px;display:grid;grid-template-columns:50% 50%;grid-gap:3px;border:1px solid #CFD9DE;border-radius:15px;overflow:hidden;">`
      media.forEach(item=>{
        html+=`<div class="" style='background-image:url("${item.url}");background-size:cover;background-position:center;background-repeat:no-repeat;'>

        </div>`
      })
      html+=`</div>`

      return html;
    }else{
      let html=`
      <div class="media" style="height:480px;margin-bottom:15px;display:grid;grid-template-columns:50% 50%;grid-column-gap:3px;border:1px solid #CFD9DE;border-radius:15px;overflow:hidden;">
        <div class="main" style='background-image:url("${media[0].url}");background-size:cover;background-position:center;background-repeat:no-repeat;'>
          <!--<img src="${media[0].url}" alt="" style="max-width:100%;max-height:100%;">-->
        </div>
        <div class="others" style="display:grid;grid-template-rows:50% 50%;grid-gap:3px;">
          <div class="" style='background-image:url("${media[1].url}");background-size:cover;background-position:center;background-repeat:no-repeat;'>
            <!--<img src="${media[1].url}" alt="" style="max-width:100%;max-height:100%;">-->
          </div>
          <div class="" style='background-image:url("${media[2].url}");background-size:cover;background-position:center;background-repeat:no-repeat;'>
            <!--<img src="${media[2].url}" alt="" style="max-width:100%;max-height:100%;">-->
          </div>
        </div>

      </div>`

      return html
    }
  }


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

const templateEnd=`</blockquote></div>
<script>
feather.replace()
</script>
</body>
</html>`


module.exports = {templateStart,addImage,addUser,addText,addMedia,addMets,addStats,templateEnd};
