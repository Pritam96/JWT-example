require('dotenv').config();

const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const posts = [
  { username: 'Brad', title: 'post 1' },
  { username: 'Max', title: 'post 2' },
];

app.get('/posts', authenticateToken, (req, res, next) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post('/login', (req, res, next) => {
  // Authenticate user

  const username = req.body.username;
  const user = { name: username };

  //token = jwt.sign(payload, secret_key, expiration_date)
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Bearer Token
  // If authHeader exist then take second parameter
  // If authHeader not exist then it simply takes undefined
  const token = authHeader && authHeader.split(' ')[1];

  // if token is null return user do not have access
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(4000);
