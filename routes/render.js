const router = require('express').Router();
const path = require('path');


router.get('/:id',async(req,res)=>{
  console.log(req.params.id);
  try {
    res.sendFile(path.resolve(`../server/${req.params.id}.html`))
  } catch (e) {
    console.log(e.message);
  }
})



module.exports = router;
