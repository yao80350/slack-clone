import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDSaHPT0j14i1tqrWWbxtOdFfhRxGCGWj4",
    authDomain: "slack-clone-8a55c.firebaseapp.com",
    databaseURL: "https://slack-clone-8a55c.firebaseio.com",
    projectId: "slack-clone-8a55c",
    storageBucket: "slack-clone-8a55c.appspot.com",
    messagingSenderId: "208395608127",
    appId: "1:208395608127:web:642f088ae398c40a29588a",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
