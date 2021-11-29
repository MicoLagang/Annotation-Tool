import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"
import 'firebase/firestore';

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL
});

export const auth = app.auth()
var fireDb = app.database();
var storage = app.storage();

// firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const appAuth = firebase.auth();

// export default fireDb.database();
export { projectStorage, projectFirestore, timestamp,storage, firebase, fireDb as default,appAuth };
