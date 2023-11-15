import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, getFirestore, initializeFirestore, persistentLocalCache,  persistentMultipleTabManager} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAJrXQY66JuycdEIOk3h_lXunPSNrVW50Y",
    authDomain: "repsie.firebaseapp.com",
    projectId: "repsie",
    storageBucket: "repsie.appspot.com",
    messagingSenderId: "741936558270",
    appId: "1:741936558270:web:f95d3641f3db2223522eef"
}
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;

// Get caching
initializeFirestore(app, {localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})});
export const contentStorage = getStorage(app);
export const db = getFirestore(app);
export const recipesCollectionRef = collection(db, 'recipes');
