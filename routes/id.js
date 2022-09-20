const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');
const pool=require('../pool')

router.get('/new',async (req,res)=>{
  const st_id=await pool.query('INSERT INTO users(token) values($1) RETURNING st_id',['default'])
  res.send(st_id.rows[0])
})

router.post('/getToken',async (req,res)=>{
  const {st_id}=req.body
  const contact=await pool.query(`SELECT token FROM users WHERE st_id=$1`,[st_id])
  if(contact.rows[0].contact=='default'){
    res.status(404).send('No username/contact for id provided')
  }else{
    res.send(contact.rows[0])
  }
})

router.post('/update',async(req,res)=>{
  const {st_id,token}=req.body
  console.log(st_id,token,'....to update')
  await pool.query('DELETE FROM users WHERE st_id=$1',[st_id])
  const update=await pool.query('INSERT INTO users(st_id,token) values($1,$2) RETURNING st_id',[st_id,token])

  res.send("Done")
})










module.exports = router;
