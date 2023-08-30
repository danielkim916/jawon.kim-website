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

app.use(express.json());

app.get('/getLikes', async (req, res) => {
  try {
    const like = await Like.findOne();
    res.json(like);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
