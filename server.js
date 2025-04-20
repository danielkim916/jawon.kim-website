const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Like = mongoose.model('Like', {
  count: Number,
});

const Comment = mongoose.model('Comment', {
  name: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

app.use(express.json());

// GET like count
app.get('/getLikes', async (req, res) => {
  try {
    const like = await Like.findOne();
    res.json(like);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Like count increase by 1
app.post('/incrementLikes', async (req, res) => {
  try {
    let like = await Like.findOne();
    if (!like) {
      like = new Like({ count: 0 });
    }
    like.count++;
    await like.save();
    res.json(like);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Like count 리셋
app.post('/resetLikes', async (req, res) => {
  try {
    let like = await Like.findOne();
    if (!like) {
      like = new Like({ count: 0 });
    } else {
      like.count = 0;
    }
    await like.save();
    res.json(like);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Override likes count API
app.post('/setLikes', async (req, res) => {
  const { newCount } = req.body;
  try {
    let like = await Like.findOne();
    if (!like) {
      like = new Like({ count: newCount });
    } else {
      like.count = newCount;
    }
    await like.save();
    res.json(like);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 댓글 저장 API
app.post('/comments', async (req, res) => {
  try {
    const { name, content } = req.body;

    if (!name || !content || name.length > 50 || content.length > 300) {
      return res.status(400).json({ message: 'Invalid name or content' });
    }

    const newComment = new Comment({
      name,
      content,
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment saved successfully' });
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 댓글 조회 API (최신순 정렬, 기본 5개, limit param 지원)
app.get('/comments', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const comments = await Comment.find()
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
