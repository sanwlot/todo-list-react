import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1EtgQd8FkD8lbqnjZphmBSXgTTFU9y4U",
  authDomain: "todo-list-sanwlot.firebaseapp.com",
  projectId: "todo-list-sanwlot",
  storageBucket: "todo-list-sanwlot.appspot.com",
  messagingSenderId: "1071524141378",
  appId: "1:1071524141378:web:739c93f44bd0e9789c50db",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
