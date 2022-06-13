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

var auth =  firebase.auth();
var db = firebase.firestore();

const unsubscribe = auth.onAuthStateChanged((user) => {
   if (user) {
      window.open('https://tenwords.kz/account', '_self');
   } else {
      update(sessionStorage.getItem('login'));
   }
});

function update(x){
   if (x == 1) {
      sessionStorage.setItem('login', 1);
      document.getElementById('reset').style.display = "none";
      document.getElementById('signUp').style.display = "none";
      document.getElementById('signIn').style.display = "flex";
      document.getElementById('loginButton').style.borderRadius = "5px";
      document.getElementById('loginButton').style.backgroundColor = "#f5d45d";
      document.getElementById('signUpButton').style.backgroundColor = "#FFFFFF";
   } else {
      sessionStorage.setItem('login', 2);
      document.getElementById('reset').style.display = "none";
      document.getElementById('signUp').style.display = "flex";
      document.getElementById('signIn').style.display = "none";
      document.getElementById('loginButton').style.backgroundColor = "#FFFFFF";
      document.getElementById('signUpButton').style.backgroundColor = "#f5d45d";
   }
}

document.getElementById('login').addEventListener('click', login);

function login(){
   startLoader();
   unsubscribe();
   localStorage.clear();
   sessionStorage.clear();
    var email = document.getElementById("userEmailLog").value;
    var password  = document.getElementById("userPassLog").value;
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        window.open('https://tenwords.kz/account', '_self');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        stopLoader();
        alert(errorCode + ' -- ' + errorMessage + '\r\n Please, contact us if you have questions!');
    });
}

document.getElementById('register').addEventListener('click', register);

function register(){
   startLoader();
   unsubscribe();
   localStorage.clear();
   sessionStorage.clear();
   var email = document.getElementById("userEmailReg").value;
   var password = document.getElementById("userPassReg").value;
   auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      var user = userCredential.user;

      db.collection("tenwords").doc(user.uid).set({
         quote: "Your future depends on what you do today."
      }).then(() => {
         user.updateProfile({
            displayName: document.getElementById("userNameReg").value
         }).then(() => {
            // console.log("DONE");
            window.open('https://tenwords.kz/account', '_self');
         });
      });
   }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      stopLoader();
      alert(errorCode + ' -- ' + errorMessage + '\r\n Please, contact us if you have questions!');
   });
}

function forgetPass(){
   document.getElementById('reset').style.display = "flex";
   document.getElementById('signIn').style.display = "none";
   document.getElementById('loginButton').style.backgroundColor = "#FFFFFF";
}

document.getElementById('reset').addEventListener('click', reset);

function reset(){
   var email = document.getElementById('userEmailRes').value;
   auth.sendPasswordResetEmail(email).then(() => {
      alert("Password reset email was sent to your email!");
   }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      update(sessionStorage.getItem('login'));
      alert(errorCode + ' -- ' + errorMessage + '\nPlease, contact us if you have questions!');
   });
}

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