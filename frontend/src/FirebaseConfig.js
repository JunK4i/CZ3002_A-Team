import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let FirebaseConfig = {
  apiKey: "AIzaSyDvoW1088TLrJzRjZI3nEwq5kWPElSNkhI",
  authDomain: "ase-project-1837e.firebaseapp.com",
  projectId: "ase-project-1837e",
  storageBucket: "ase-project-1837e.appspot.com",
  messagingSenderId: "643592206256",
  appId: "1:643592206256:web:addd3a8434c9b907018875",
  measurementId: "G-CE67SS1VZT",
};

const app = initializeApp(FirebaseConfig);

const auth = getAuth(app);

export { auth };
