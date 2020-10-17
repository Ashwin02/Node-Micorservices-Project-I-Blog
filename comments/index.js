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

    comment.push({"id": id, "content": content, "status": "pending"});
    commentsByPostId[req.params.id] = comment;

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {id, content, postId: req.params.id, status: "pending"}
    });


    return res.status(201).send(comment);
});

app.post('/events', async (req,res) =>{
    const {type, data} = req.body;
    if(type === 'CommentModerated'){
        const {postId, id, status, content} = data;

        const comments = commentsByPostId[postId].comments || [];
        const comment = comments.find(c => c.id === id);
        if(comment){
            comment.status = status;
        }
        await axios.post('http://event-bus-srv:4005/events',{
            type: 'CommentUpdated',
            data:{
                id,
                postId,
                content,
                status
            }
        })
    }
    res.send({});
});

app.listen(4001, () =>{
    console.log("Server listning on port 4001");
});

