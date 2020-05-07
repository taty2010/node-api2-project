const express = require('express');
const Posts = require('./data/db.js');

const router = express.Router();

router.get('/', (req,res)=>{//Get all posts *COMPLETED*
    Posts.find()
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(500).json({error: "The posts information could not be retrieved."})
        })
});

router.get('/:id', async (req,res)=>{//Get posts by id *COMPLETED*
    const {id} = req.params
    console.log(res.body)
    try{
    const post = await Posts.findById(id)
    console.log(post.length)
        if(post.length < 1){ 
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }else{ res.status(200).json({post})}
    }catch(err){
            res.status(500).json({error: "The post information could not be retrieved."})
        }
});

router.get('/:id/comments', async (req,res) => {//Get all comments under post id *COMPLETED*
    const {id} = req.params

    try {
        const post = await Posts.findById(id);
        console.log(post.length)
        if (post.length !== 1) return res.status(404).json({ message: "There are no comments with the specified post id" });
        const comments = await Posts.findPostComments(id);
         res.status(200).json({comments});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error retreiving comment for this post'});
    }

    // Posts.findById(id)
    //   .then((post) => {
    //     if (id.length !== 1) return res.status(404).json({ message: "There are no comments with the specified post id" });
    //     Posts.findPostComments(id)
    //         .then(comments => {
    //             comments ? res.status(200).json({comments}) : res.status(404).json({message: 'No comments for this post'});
    //         }).catch (err => {
    //           console.log(err)
    //           res.status(500).json({message: 'Error retreiving comment for this post'})
    //         });
    //   }).catch (err => {
    //     console.log(err)
    //     res.status(500).json({message: 'Error retreiving comment for this post'})
    // });
});

router.get('/:id/comments/:id',(req,res)=>{//Get comments under post id by comment id *COMPLETED*
    const {id} = req.params 
    Posts.findCommentById(id)
    .then(commentId =>{
        commentId ? res.status(200).json({commentId}) : res.status(404).json({success:false, message: 'Invalid post ID'});
    }).catch (err => {
            console.log(err)
            res.status(500).json({message: 'Error retreiving comment'})
        });
});



router.post('/', (req,res)=>{//Create new post *COMPLETED*
    const posts = req.body;
    console.log(req.body)
    if(!posts.title || !posts.contents){ 
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    } else {
        Posts.insert(posts)
            .then(postNew => {res.status(201).json({sucess:true, posts});
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "There was an error while saving the post to the database"})
            })
    }
})

router.post('/:id/comments', async (req,res)=>{// Create new comment under post id *COMPLETED*
    const comments = {...req.body, post_id: req.params.id};
    const {id} = req.params;
    const body = req.body
    try{
        const post = await Posts.findById(id)
        if(post.length !== 1)res.status(404).json({message: "The post with the specified ID does not exist."})
        else if (!body.text)res.status(400).json({errorMessage: "Please provide text for the comment."})
        else {const comment = await Posts.insertComment(comments)
        res.status(201).json(body)};
    }catch (err){
        console.log(err);
        res.status(500).json({error: "There was an error while saving the comment to the database"})
    }
})

router.put('/:id', (req, res) => {// *Completed*
    const changes = req.body;
    const {id} = req.params
    Posts.update(id, changes)
        .then(post => {
            if (!changes.title || !changes.contents) {
                res.status(400).json({errorMessage: "Please provide title and contents for the post."})
            }
            else if (post) {
                res.status(200).json(changes);
            } else {
                res.status(404).json({  message: "The post with the specified ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post information could not be modified."
            });
        });
});

router.delete('/:id', (req,res)=>{//*COMPLETED*
    const {id} = req.params;
    Posts.remove(id)
        .then(post => {
            post > 0 ? res.status(200).json({message: 'The post has been deleted'}) : res.status(404).json({message: 'The post with the specified ID does not exist.'});  
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The post could not be removed"
            })
        })
})

module.exports = router;