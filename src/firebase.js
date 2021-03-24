import Firebase from "firebase"

const firebaseApp = Firebase.initializeApp({
    apiKey: "AIzaSyAMJ6ubggUyJr3l0bz9DUQZGX6zzBxKiAM",
    authDomain: "instagram-clone-195.firebaseapp.com",
    projectId: "instagram-clone-195",
    storageBucket: "instagram-clone-195.appspot.com",
    messagingSenderId: "310669400793",
    appId: "1:310669400793:web:db4c3073b6c12bfa8bfcc8",
    measurementId: "G-EKBZ6TN0T8"
})

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {db,auth,storage}; 