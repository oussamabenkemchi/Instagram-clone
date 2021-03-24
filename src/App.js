import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Modal from "@material-ui/core/Modal";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //if user is logged in
        console.log(authUser);
        setUser(authUser);
        /*   if (authUser.displayName) {
          } else {
            return authUser.updateProfile({ displayName: username });
          } */
      } else {
        // user has logged out
        setUser(null);
      }
    });

    return () => {
      unsubscribed();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({ displayName: username });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {/*  {body} */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <div className="modal__header">
              <h2>Sign up</h2>
              <img
                alt="this is the post image"
                className="app__headerImage"
                src="https://mobiledevmemo.com/wp-content/uploads/2017/11/Can-Instagram-Boost-Business-Sales.jpg"
              />
            </div>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        {/*  {body} */}
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <div className="modal__header">
              <h2>Sign In</h2>
              <img
                alt="this is the post image"
                className="app__headerImage"
                src="https://mobiledevmemo.com/wp-content/uploads/2017/11/Can-Instagram-Boost-Business-Sales.jpg"
              />
            </div>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://play-lh.googleusercontent.com/9ASiwrVdio0I2i2Sd1UzRczyL81piJoKfKKBoC8PUm2q6565NMQwUJCuNGwH-enhm00"
          alt="instagram logo"
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              Sign Up
            </Button>

            <Button
              onClick={() => {
                setOpenSignIn(true);
              }}
            >
              Sign In
            </Button>
          </div>
        )}
      </div>

      {/* 
      <Post
        username="Oussama"
        caption="Wow this is an awesome technology"
        imageUrl="https://firebase.google.com/images/social.png"
      />
      <Post
        username="Hamid"
        caption="that works"
        imageUrl="https://reactjs.org/logo-og.png"
      />
      <Post  
        username="ahmed"
        caption="Thats freaking awesome !:)"
        imageUrl="https://miro.medium.com/max/1838/1*MuVcoMPyJcq8G4qf5s3HGQ.png"
      /> */}

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              user ={user}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/CMmF-DEsF1b/?utm_source=ig_web_copy_link"
            clientAccessToken="536107377368714|ddc023bef5072ebd14dcd85fd748ee1c"
            maxWidth={900}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3 className="text">You want to post, please login</h3>
      )}
    </div>
  );
}

export default App;
