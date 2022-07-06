const router = require('express').Router();
const fetch=require('node-fetch');
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

router.post('/shot',async(req,res)=>{

  const {name}=req.body
  console.log(`${name}...shot`);
  const browser=await puppeteer.launch({headless:true})
  const page=await browser.newPage()
  await page.goto(`http://localhost:5000/render/${name}`)
  const img=await page.screenshot({path:`${name}.png`})
  // console.log(encodeImageFileAsURL(img));
  await browser.close()
  // const dts=fs.readFileSync(path.join(__dirname+'/1535547400881848320.png'),{encoding:'base64'})
  console.log('Screenshot taken');
  res.json({"Status":"Screenshot taken"})
})

module.exports = router;
