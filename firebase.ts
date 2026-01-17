
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOg9Cg9SeairHrosVqT9kP00ydEdPSamQ",
  authDomain: "login-1d9dc.firebaseapp.com",
  projectId: "login-1d9dc",
  storageBucket: "login-1d9dc.firebasestorage.app",
  messagingSenderId: "660247579508",
  appId: "1:660247579508:web:c52028653848d13500ba21",
  measurementId: "G-KXBTVVCED7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics, logEvent };
