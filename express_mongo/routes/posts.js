const express = require("express")
const Posts = require("../models/Posts")

const router = express.Router();


// gets back all post
router.get("/",async (req,res)=>{
    const posts = await Posts.find(); 
    
    res.json(posts)
})

// submits a post
router.post("/",(req,res)=>{
    const post = new Posts({
        title:req.body.title,
        description: req.body.description
    })

    post.save().then(data=>res.json(data)).catch(err => {
        res.json({message: err})
    })
})

//specific post

router.get("/:postId",async (req,res)=>{
    const result = await Posts.findById(req.params.postId)
    res.json(result)
})

// delete 
router.delete("/:postId",async (req,res)=>{
    const deleted = await Posts.deleteOne({_id:req.params.postId})
    res.json(deleted)
})

//update

router.patch("/:postId",async (req,res)=>{
    const updated = await Posts.updateOne({_id:req.params.postId},{$set:{title:req.body.title}})
    res.json(updated)
})

module.exports = router;