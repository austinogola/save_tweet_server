const router = require('express').Router();
const path = require('path');


router.get('/:id',async(req,res)=>{
  try {
    res.sendFile(path.join(__dirname,`/../${req.params.id}.html`))
  } catch (e) {
    console.log(e.message);
  }
})



module.exports = router;
