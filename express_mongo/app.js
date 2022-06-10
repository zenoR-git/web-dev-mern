const express = require("express")
const mongoose = require("mongoose")
 require("dotenv/config")
 const postsRoute = require('./routes/posts')
 const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.json())
app.use('/post',postsRoute)
app.get("/",(req,res)=>{
     res.send("hello world")
})

//db reading

mongoose.connect(process.env.DB_CONNECTION,()=>{
    console.log("connected to db")
})

app.listen(3000,()=>{
    console.log("app running at port 3000...")
})