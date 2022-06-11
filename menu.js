const firebaseConfig = {
   apiKey: "AIzaSyDaNRi01T869j0i-bP4fcUWoFEAqLQ4UCc",
   authDomain: "tenwords-91574.firebaseapp.com",
   projectId: "tenwords-91574",
   storageBucket: "tenwords-91574.appspot.com",
   messagingSenderId: "808767742785",
   appId: "1:808767742785:web:afa464c329dde9323937c0",
   measurementId: "G-7YP48C1N6M"
 };
 
 firebase.initializeApp(firebaseConfig);
 firebase.analytics();
 
 auth =  firebase.auth();
 
 function openPage(page){
    if (page == 'account'){
       window.open('https://tenwords.kz/account/', "_self");
    } else if (page == 'login') {
       sessionStorage.setItem('login', 1);
       window.open('https://tenwords.kz/login/', "_self");
    } else if (page == 'signup') {
       sessionStorage.setItem('login', 2);
       window.open('https://tenwords.kz/login/', "_self");
    }
 }
 
 auth.onAuthStateChanged((user) => {
    if (user) {
       document.getElementById("signup").style.display = "none";
       document.getElementById("login").style.display = "none";
       document.getElementById("account").style.display = "flex";
    } else {
       document.getElementById("signup").style.display = "flex";
       document.getElementById("login").style.display = "flex";
       document.getElementById("account").style.display = "none";
    }
 });
 
 function startLoader(){
    document.getElementById('body').style.filter = 'blur(15px)';
    document.getElementById('body').style.pointerEvents = "none";
    document.getElementById('loader').style.display = 'block';
 }
 
 function stopLoader(){
    document.getElementById('body').style.filter = 'blur(0px)';
    document.getElementById('body').style.pointerEvents = "auto";
    document.getElementById('loader').style.display = 'none';
 } 