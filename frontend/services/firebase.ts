import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASxHWIjecZBOwUmf5EYyME9w373fdMQ78",
  authDomain: "study-group-app-13e16.firebaseapp.com",
  databaseURL: "https://study-group-app-13e16-default-rtdb.firebaseio.com",
  projectId: "study-group-app-13e16",
  storageBucket: "study-group-app-13e16.firebasestorage.app",
  messagingSenderId: "656534856937",
  appId: "1:656534856937:web:2b35e41491fb6c356d7c78"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);