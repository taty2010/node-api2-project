const express = require('express');

const postsRouter = require('./posts-router')

const server = express();

server.use(express.json());

server.use('/api/posts', postsRouter);
server.use('/api/posts/:id/comments', postsRouter);
server.use('/api/posts/:id', postsRouter);

server.get('/', (req,res) => {
    res.send(`
        <h2>API Posts Projects</h2>
    `)
});

module.exports = server;
