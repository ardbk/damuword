const firebaseConfig = {
   apiKey: "AIzaSyDL_P3v2GI-T1_yDC5XF8ggakSZklRfZO0",
  authDomain: "damuword-fdb1b.firebaseapp.com",
  projectId: "damuword-fdb1b",
  storageBucket: "damuword-fdb1b.appspot.com",
  messagingSenderId: "1045885837483",
  appId: "1:1045885837483:web:61a1eca3e227c4ec4e17ee",
  measurementId: "G-H9EJWKL9H4"
};
 
firebase.initializeApp(firebaseConfig);
analytics = firebase.analytics();
 
 auth =  firebase.auth();
 
 function openPage(page){
    if (page == 'account'){
      analytics.logEvent("menu", {
         method: "account"
      });
       window.open('https://damuword.kz/account/', "_self");
    } else if (page == 'login') {
      analytics.logEvent("menu", {
         method: "login"
      });
       sessionStorage.setItem('login', 1);
       window.open('https://damuword.kz/login/', "_self");
    } else if (page == 'signup') {
      analytics.logEvent("menu", {
         method: "signup"
      });
       sessionStorage.setItem('login', 2);
       window.open('https://damuword.kz/login/', "_self");
    }
 }
 
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