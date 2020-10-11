const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId={};

app.get('/posts/:id/comments', (req, res) =>{
    return res.status(200).send(commentsByPostId[req.params.id] || []);
});

/** Sample Body: {"id":"1234ab""content":"Some Comment"} */
app.post('/posts/:id/comments', (req, res) =>{
    const {content} = req.body;
    const id = randomBytes(4).toString('hex');

    const comment = commentsByPostId[req.params.id] || [];

    comment.push({"id": id, "content": content});
    commentsByPostId[req.params.id] = comment;

    return res.status(201).send(comment);
});

app.listen(4001, () =>{
    console.log("Server listning on port 4001");
});

