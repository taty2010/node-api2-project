const express = require('express');
const Posts = require('./data/db.js');

const router = express.Router();

router.get('/', (req,res)=>{//Get all posts
    Posts.find()
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(500).json({success: false, err})
        })
});

router.get('/:id', (req,res)=>{//Get posts by id
    const {id} = req.params
    Posts.findById(id)
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(404).json({success: false, err})
        })
});

router.get('/:id/comments', async (req,res)=>{//Get all comments under post id 
    const {id} = req.params
    try{
        const comments = await Posts.findPostComments(id);

        comments.length > 0 ? res.status(200).json({comments}) : res.status(404).json({message: 'No comments for this post'});
    }catch (err) {
            console.log(err)
            res.status(500).json({message: 'Error retreiving comment for this post'})
        };
});

router.get('/:id/comments/:id', async (req,res)=>{//Get comments under post id by comment id
    const {id} = req.params
    try{
        const comments = await Posts.findCommentById(id);

        comments ? res.status(200).json({comments}) : res.status(404).json({success:false, message: 'Invalid post ID'});
    }catch (err) {
            console.log(err)
            res.status(500).json({message: 'Error retreiving comment'})
        };
});



router.post('/', (req,res)=>{//Create new post 
    const body = req.body;
    console.log(req.body)
    if(!body.title || !body.contents){ 
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
        Posts.insert(req.body)
            .then(postNew => {res.status(200).json({sucess:true, postNew});
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "There was an error while saving the post to the database"})
            })
    }
})

router.post('/:id/comments', async (req,res)=>{// Create new comment under post id
    const comments = {...req.body, post_id: req.params.id};

    try{
        const comment = await Posts.insertComment(comments);
        res.status(201).json(comment);
    }catch (err){
        console.log(err);
        res.status(500).json({err})
    }
})

router.put('/:id', (req,res)=>{
    const body = req.body;
    const {id} = req.params;

    Posts.update(id, body)
        .then(post => {
            res.status(201).json({sucess:true, post})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Error updating post'})
        })
});

router.delete('/:id', (req,res)=>{
    const {id} = req.params;
    Posts.remove(id)
        .then(post => {
            post > 0 ? res.status(200).json({message: 'The post has been deleted'}) : res.status(404).json({message: 'The post could not be found'});  
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message:'Error removing post'
            })
        })
})

module.exports = router;