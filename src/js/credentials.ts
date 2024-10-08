// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-UMNEnONlRHgtvfQ04aEjPNHvYdNBGTE",
  authDomain: "api-node-e6599.firebaseapp.com",
  projectId: "api-node-e6599",
  storageBucket: "api-node-e6599.appspot.com",
  messagingSenderId: "199448829494",
  appId: "1:199448829494:web:938673b4feb6039b524297",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
