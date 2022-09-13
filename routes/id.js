const router = require('express').Router();
const fetch=require('node-fetch');
const details = require('../middleware/details');
const authUrl = require('../middleware/authUrl');
const pool=require('../pool')

router.get('/new',async (req,res)=>{
  console.log('made here');
  const st_id=await pool.query('INSERT INTO users(contact) values($1) RETURNING st_id',['default'])
  res.send(st_id.rows[0])
})

router.post('/getContact',async (req,res)=>{
  const {st_id}=req.body
  const contact=await pool.query(`SELECT contact FROM users WHERE st_id=$1`,[st_id])
  console.log(contact.rows[0]);
  if(contact.rows[0].contact=='default'){
    res.status(404).send('No username/contact for id provided')
  }else{
    res.send(contact.rows[0])
  }
})

router.post('/add',async(req,res)=>{
  const {st_id,contact}=req.body
  const item=await pool.query('UPDATE users SET contact=$1 WHERE st_id=$2',[contact,st_id])
  res.send("Done")
})










module.exports = router;
