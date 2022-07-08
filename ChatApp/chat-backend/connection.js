const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION, ()=>{
    console.log("connected to mongoDB")
})