const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const postsFilePath = path.join(__dirname, 'posts.json');

const readJSONFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath));
    }
    return [];
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get('/posts', (req, res) => {
    const posts = readJSONFile(postsFilePath);
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const posts = readJSONFile(postsFilePath);
    const newPost = req.body;
    posts.push(newPost);
    writeJSONFile(postsFilePath, posts);
    res.json(newPost);
});

app.post('/posts/:id/comments', (req, res) => {
    const posts = readJSONFile(postsFilePath);
    const post = posts.find(p => p.id === parseInt(req.params.id));
    const newComment = req.body;
    if (post) {
        post.comments.push(newComment);
        writeJSONFile(postsFilePath, posts);
        res.json(newComment);
    } else {
        res.status(404).send('Post not found');
    }
});

app.delete('/posts/:id', (req, res) => {
    let posts = readJSONFile(postsFilePath);
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex !== -1) {
        posts.splice(postIndex, 1);
        writeJSONFile(postsFilePath, posts);
        res.sendStatus(200);
    } else {
        res.status(404).send('Post not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
