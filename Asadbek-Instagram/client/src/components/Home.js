import React, { useEffect, useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [commentedItem, setCommentedItem] = useState({});
  const notifyError = (msg) => toast.error(msg);
  const notifySuccess = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("cookie");

    if (!token) {
      navigate("./signin");
    }

    // Fetching all posts
    fetch("https://insta-clon-beknur.netlify.app/allPosts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("cookie"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result);
      })
      .catch((err) => console.log(err));
  }, []);

  // To show and hide comments
  const toggleComment = (posts) => {
    if (showComment) {
      setShowComment(false);
    } else {
      console.log(posts);
      setCommentedItem(posts);
      setShowComment(true);
    }
  };

  const likePost = (id) => {
    fetch("https://insta-clon-beknur.netlify.app//like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cookie"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = Data.map((posts) => {
          console.log(result._id);
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      });
  };

  const unlikePost = (id) => {
    fetch("https://insta-clon-beknur.netlify.app//unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cookie"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = Data.map((posts) => {
          if (posts._id === result._id) {
            console.log(result);
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
      });
  };

  const makeComment = (text, id) => {
    fetch("https://insta-clon-beknur.netlify.app//comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("cookie"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = Data.map((posts) => {
          console.log(result._id);
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifySuccess("Comment posted");
        console.log(result);
      });
  };

  return (
    <div className="body">
      {Data.map((posts) => {
        return (
          <div className="card" key={posts._id}>
            <div className="card-header">
              <img
                src="https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
                alt=""
              />
              <h5>
                <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}
                </Link>
              </h5>
            </div>
            <div className="card-body">
              <img src={posts.photo} alt="" />
            </div>
            <div className="card-footer">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user")).userid
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}
              <p>{posts.likes.length} likes</p>
              <p>{posts.body}</p>
              <h5
                style={{ fontSize: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all comments
              </h5>
            </div>

            <div className="card-comment">
              <span className="material-symbols-outlined">
                sentiment_satisfied
              </span>
              <input
                type="text"
                style={{ background: "#292525", color: "#d5FF40" }}
                placeholder="Add a Comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}
      {/* ----show all comment's start----- */}
      {showComment && (
        <div className="show-comment">
          <div className="container">
            <div className="pic-container">
              <img src={commentedItem.photo} alt="" />
            </div>
            <div className="detail">
              <div
                className="card-header"
                style={{ borderBottom: "1px solid rgb(148 165 86) " }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60"
                    alt=""
                  />
                </div>
                <div className="card-pic">
                  <h5>{commentedItem.postedBy.name}</h5>
                </div>
              </div>
              {commentedItem.comments.map((comment) => {
                return (
                  <h5 key={comment._id}>
                    <span style={{ fontWeight: "500" }}>
                      {comment.postedBy.name}
                    </span>{" "}
                    {comment.text}
                  </h5>
                );
              })}
            </div>
            <div
              className="back-btn"
              onClick={() => {
                setShowComment(false);
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </div>
          </div>
        </div>
      )}
      {/* ----show all comment's end----- */}
    </div>
  );
}
