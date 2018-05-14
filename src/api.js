import firebase from "firebase/app"
import 'firebase/database'
import 'firebase/auth'
import secret from "./config"
const config = {
    apiKey: secret.apiKey,
    authDomain: secret.authDomain,
    databaseURL: secret.databaseURL,
    storageBucket: secret.storageBucket,
  };
  firebase.initializeApp(config);
const database = firebase.database();
const api = {};

api.getMessages = function(){
    return database.ref('messages');
} 

export default api;