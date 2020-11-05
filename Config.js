import * as firebase from 'firebase';
require("@firebase/firestore")
var firebaseConfig = {
    apiKey: "AIzaSyCKjVHsA-kRZGiKlFLdGFr1CyLp62XjgFY",
    authDomain: "book-santa-1d813.firebaseapp.com",
    databaseURL: "https://book-santa-1d813.firebaseio.com",
    projectId: "book-santa-1d813",
    storageBucket: "book-santa-1d813.appspot.com",
    messagingSenderId: "374645098245",
    appId: "1:374645098245:web:9e6ebdd6b94008f3e3d96c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)

  export default firebase.firestore();