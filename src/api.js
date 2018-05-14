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
const auth = firebase.auth();
const api = {};

api.db = function (reference) {
    return database.ref(reference);
}

api.registerWithEmail = function (email,password){
    return auth.createUserWithEmailAndPassword(email,password);
}
api.auth = function (){
    return firebase.auth()
}

export default api;