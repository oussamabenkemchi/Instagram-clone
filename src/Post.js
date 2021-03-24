import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import Firebase from "firebase"

function Post({postId,username,user,caption,imageUrl}) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState("")

  useEffect(() => {
      let unsubscribe;  
    if(postId){
        unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp',"desc")
        .onSnapshot((snapsot) =>{
          setComments(snapsot.docs.map(doc => doc.data()))
        })
      }
      return () => unsubscribe();
    }
  , [postId])


  const postComment = (event) =>{
      event.preventDefault();
      db.collection("posts").doc(postId).collection("comments").add({
        username:user.displayName,
        text:comment,
        timestamp:Firebase.firestore.FieldValue.serverTimestamp()
      })
      setComment("")
  }

  return (
    <div className="post">
    <div className="post__header">
    <Avatar 
      className="post__avatar"
      src="/static/images/avatar/1.jpg" />
      <h3>{username}</h3>
      
    </div>
     
      <img
        className="post__image"
        src={imageUrl}
        alt="react image"
      />

      <h4 className="post__text">
        <strong>{username}</strong> <br/>
        <hr />
        {caption}
      </h4>

      
      

      <div className="post__comments">
        {
              comments.map(comment =>(
                <p className="post__textComment">
                  <b>{comment.username+"  "}</b>
                  {comment.text}
                </p>
              ))
        }
      </div>

      {
        user?.displayName &&
        <form className="post__commentBox">
          <input 
            className="post__input"
            type="text"
            placeholder="add a comment ..."
            value = {comment}
            onChange ={ e => setComment(e.target.value)}

          />

          <button
             className="post__button"
             disabled={!comment}
             type="submit"
             onClick={postComment}
          >
          Post
          </button>
      </form>
      }

    </div>
  );
}

export default Post;
