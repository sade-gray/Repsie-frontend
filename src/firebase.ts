import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

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
// @ts-ignore
export default app;