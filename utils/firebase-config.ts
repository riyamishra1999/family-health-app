import firebase, { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCmwplQHwvLIEe25n8Ll6Od7XiRSgR50kA",
  authDomain: "family-health-ca80d.firebaseapp.com",
  projectId: "family-health-ca80d",
  storageBucket: "family-health-ca80d.appspot.com",
  messagingSenderId: "457302448053",
  appId: "1:457302448053:web:4ec721bf1ddc1e5e196bfc",
  measurementId: "G-M0KKE3Z6F4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
