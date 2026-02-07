import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 1. Parse the environment variable string back into an object
const firebaseConfigString = process.env.FIREBASE_CONFIG;

let app;
let auth;
let db;
let storage;

if (!firebaseConfigString) {
  console.warn("FIREBASE_CONFIG is not set in .env.local. Firebase features will be disabled.");
} else {
  try {
    // Convert the string '{"apiKey":"..."}' back to a real JavaScript Object
    const firebaseConfig = JSON.parse(firebaseConfigString);

    // 2. Initialize Firebase
    // We check getApps() to ensure we don't initialize it twice (Next.js specific fix)
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    // 3. Export the services we want to use
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { app, auth, db, storage };