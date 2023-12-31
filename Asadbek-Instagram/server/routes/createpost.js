const express = require("express");
const router = express.Router();
const Post = require("../model/posts");
const User = require("../model/User");

router.get("/myposts", async (req, res) => {
  // Foydalanuvchining tokenini olish
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const cookies = authorization.replace("Bearer ", "");

  console.log(cookies);
  
  // Foydalanuvchining postlarini topish
  Post.find({ postedBy: cookies })
    .populate("postedBy", "_id , name")
    .then((myposts) => {
      res.json(myposts);
    });
});

router.get("/allPosts", (req, res) => {
  // Barcha postlarni olish
  Post.find()
    .populate("postedBy", "_id name Photo username")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      console.log(posts);
      return res.json(posts);
    })
    .catch((err) => console.log(err));
});

router.post("/createPost", async (req, res) => {
  // Post yaratish
  const { body, pic } = req.body;
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const cookies = authorization.replace("Bearer ", "");

  console.log(cookies);
  const auth = await User.findById(cookies);
  console.log(auth);
  if (!auth) return res.status(401).json({ error: "You have to logged first" });

  if (!body || !pic)
    return res.status(422).json({ error: "Please add all the field " });

  const post = new Post({
    body,
    photo: pic,
    postedBy: cookies,
  });
  post
    .save()
    .then((result) => {
      return res.json({ post: result });
    })
    .catch((err) => console.log(err));
});

router.put("/like", (req, res) => {
  // Postga "like" berish
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const user_id = authorization.replace("Bearer ", "");
  console.log(req.body.postId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: user_id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name Photo username ")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

router.put("/unlike", (req, res) => {
  // Postdan "like" olib tashlash
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const user_id = authorization.replace("Bearer ", "");

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: user_id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name Photo username")
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

router.put("/comment", (req, res) => {
  // Postga murojaat qo'shish
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You must have logged in 1" });
  }
  const user_id = authorization.replace("Bearer ", "");
  console.log(req.body.text);
  console.log(req.body.postId);
  const comment = {
    comment: req.body.text,
    postedBy: user_id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name Photo")
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

// Postni o'chirish
router.delete("/deletePost/:postId", (req, res) => {
  console.log(req.params.postId);
  Post.findByIdAndRemove(req.params.postId)
    .then((result) => {
      return res.json({ message: "Successfully deleted" });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

module.exports = router;
