import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDKoTjAj4Xytzsr1AQsYEbBTPLayz6KNlM",
  authDomain: "flipcard-64.firebaseapp.com",
  projectId: "flipcard-64",
  storageBucket: "flipcard-64.firebasestorage.app",
  messagingSenderId: "799858892244",
  appId: "1:799858892244:web:4d3de687907860f385ca41",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

