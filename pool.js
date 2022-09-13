const Pool = require('pg').Pool
require('dotenv').config()

const pool=new Pool({
    user:process.env.db_user,
    database:process.env.db_db,
    password:process.env.db_pass,
    host:'localhost',
    port:5432
})

module.exports=pool
