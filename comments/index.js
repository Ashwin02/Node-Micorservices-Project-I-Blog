const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId={};

app.get('/posts/:id/comments', (req, res) =>{
    return res.status(200).send(commentsByPostId[req.params.id] || []);
});

/** Sample Body: {"id":"1234ab""content":"Some Comment"} */
app.post('/posts/:id/comments', async (req, res) =>{
    const {content} = req.body;
    const id = randomBytes(4).toString('hex');

    const comment = commentsByPostId[req.params.id] || [];

    comment.push({"id": id, "content": content});
    commentsByPostId[req.params.id] = comment;

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {id, content, postId: req.params.id}
    });

    return res.status(201).send(comment);
});

app.post('/events', (req,res) =>{
    const {type} = req.body;
    console.log("Received event: ", type);
    res.send({});
});

app.listen(4001, () =>{
    console.log("Server listning on port 4001");
});

