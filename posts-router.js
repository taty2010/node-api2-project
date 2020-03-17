const express = require('express');
const Posts = require('./data/db.js');

const router = express.Router();

router.get('/', (req,res)=>{
    Posts.find()
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(500).json({success: false, err})
        })
});

router.get('/:id', (req,res)=>{
    const {id} = req.params
    Posts.findById(id)
        .then(post => {
            res.status(200).json({post})
        })
        .catch(err => {
            res.status(404).json({success: false, err})
        })
});

router.post('/', (req,res)=>{
    const body = req.body;

    Posts.insert(body)
        .then(post => {
            res.status(201).json({sucess:true, post})
        })
        .catch(err => {
            res.status(500).json({success: false, err})
        })
})

module.exports = router;