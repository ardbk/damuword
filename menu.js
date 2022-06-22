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

document.getElementById("accountBtn").addEventListener("click", function(){
   window.open('https://damuword.kz/account/', "_self");
});

document.getElementById("loginBtn").addEventListener("click", function(){
   sessionStorage.setItem('login', 1);
   window.open('https://damuword.kz/login/', "_self");
});

document.getElementById("signupBtn").addEventListener("click", function(){
   sessionStorage.setItem('login', 2);
   window.open('https://damuword.kz/login/', "_self");
});
 
auth.onAuthStateChanged((user) => {
   if (user) {
      document.getElementById("signup").style.display = "none";
      document.getElementById("login").style.display = "none";
      document.getElementById("account").style.display = "inline-block";
   } else {
      document.getElementById("signup").style.display = "inline-block";
      document.getElementById("login").style.display = "inline-block";
      document.getElementById("account").style.display = "none";
   }
});
 
function startLoader(){
   document.getElementById('body').style.filter = 'blur(15px)';
   document.getElementById('body').style.pointerEvents = "none";
   document.getElementById('loader').classList.add("d-flex");
}
 
function stopLoader(){
   document.getElementById('body').style.filter = 'blur(0px)';
   document.getElementById('body').style.pointerEvents = "auto";
   document.getElementById('loader').classList.remove("d-flex");
}

export {analytics, auth, db, storage};
export {startLoader, stopLoader};