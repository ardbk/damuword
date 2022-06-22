import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDL_P3v2GI-T1_yDC5XF8ggakSZklRfZO0",
    authDomain: "damuword-fdb1b.firebaseapp.com",
    projectId: "damuword-fdb1b",
    storageBucket: "damuword-fdb1b.appspot.com",
    messagingSenderId: "1045885837483",
    appId: "1:1045885837483:web:61a1eca3e227c4ec4e17ee",
    measurementId: "G-H9EJWKL9H4"
};

var app = initializeApp(firebaseConfig);
var analytics = getAnalytics(app);
var auth = getAuth(app);
var db = getFirestore(app);
var storage = getStorage(app);

logEvent(analytics, 'notification_received');

export {analytics, auth, db, storage};