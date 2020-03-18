const express = require('express');
const Posts = require('./data/db.js');

const router = express.Router();

router.get('/', (req,res)=>{//Get all posts
    Posts.find()
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(500).json({error: "The posts information could not be retrieved."})
        })
});

router.get('/:id', (req,res)=>{//Get posts by id
    const {id} = req.params

    Posts.findById(id)
        .then(post => {
            if(!id){ 
                res.status(404).json({message: "The post with the specified ID does not exist."})
        }else{ res.status(200).json({post})}
        })
        .catch(err => {
            res.status(500).json({error: "The post information could not be retrieved."})
        })
});

router.get('/:id/comments', (req,res)=>{//Get all comments under post id 
    const {id} = req.params

    Posts.findPostComments(id)
    .then(comments => {
        comments ? res.status(200).json({comments}) : res.status(404).json({message: 'No comments for this post'});
    }).catch (err => {
            console.log(err)
            res.status(500).json({message: 'Error retreiving comment for this post'})
        });
});

router.get('/:id/comments/:id',(req,res)=>{//Get comments under post id by comment id
    const {id} = req.params
    Posts.findCommentById(id)
    .then(commentId =>{
        commentId ? res.status(200).json({commentId}) : res.status(404).json({success:false, message: 'Invalid post ID'});
    }).catch (err => {
            console.log(err)
            res.status(500).json({message: 'Error retreiving comment'})
        });
});



router.post('/', (req,res)=>{//Create new post 
    const posts = req.body;
    console.log(req.body)
    if(!posts.title || !posts.contents){ 
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
        Posts.insert(posts)
            .then(postNew => {res.status(201).json({sucess:true, postNew});
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "There was an error while saving the post to the database"})
            })
    }
})

router.post('/:id/comments', (req,res)=>{// Create new comment under post id
    const comments = {...req.body, post_id: req.params.id};
    console.log(comments)
    Posts.insertComment(comments)
    .then(comment => {
        !req.params.id ? res.status(404).json({message: "The post with the specified ID does not exist."}) : res.status(201).json(comment);
    }).catch (err => {
        console.log(err);
        res.status(500).json({err})
    })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    const {id} = req.params
    Posts.update(id, changes)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({  message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be modified." ,
            });
        });
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