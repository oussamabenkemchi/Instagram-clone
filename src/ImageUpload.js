import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import Firebase from "firebase";
import "./ImageUpload.css"

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  //const [url, setUrl] = useState("")
  const [progress, setProgress] = useState("");

  const handleCaption = (event) => {
    const value = event.target.value;
    setCaption(value);
  };

  const handleFileUpload = (e) => {
     const  value = e.target.files[0]
    if (value) {
      setImage(value);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref("images/" + image.name).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: Firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });


            setProgress(0);
            setCaption("");

            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        placeholder="Enter a caption"
        type="text"
        onChange={handleCaption}
        value ={caption}
      />
      <input type="file" onChange={handleFileUpload} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
