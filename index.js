const express = require('express');
const cors = require('cors');

const app=express()
const port=process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/save_tweet',require('./routes/save_tweet'))
app.use('/screenshot',require('./routes/screenshot'))
app.use('/createTweet',require('./routes/createTweet'))
app.use('/render',require('./routes/render'))
app.use('/google',require('./routes/google'))
app.use('/id',require('./routes/id'))
app.use('/firebase',require('./routes/firebase'))
app.use('/test',require('./routes/test'))


// process.on('uncaughtException', (error)  => {
//   console.log('Alert! ERROR : ',  error);
//   process.exit(1); // Exit your app 
// })


// process.on('unhandledRejection', (error, promise)  => {
//   console.log('Alert! ERROR : ',  error);
//   process.exit(1); // Exit your app 
// })


app.listen(port,()=>{
  console.log(`Server Running Good on Port ${port}`);
})
