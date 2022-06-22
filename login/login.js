import {auth, db} from '/menu.js';
import {startLoader, stopLoader} from '/menu.js';

const unsubscribe = auth.onAuthStateChanged((user) => {
   if (user) {
      window.open('https://damuword.kz/account', '_self');
   } else {
      if (sessionStorage.getItem('login') == 1){
         displayLogin();
      } else {
         displaySignup();
      }
   }
});


document.getElementById("showLoginBtn").addEventListener("click", displayLogin);
document.getElementById("showSignupBtn").addEventListener("click", displaySignup);


function displayLogin(){
   sessionStorage.setItem('login', 1);
   document.getElementById('resetDiv').style.display = "none";
   document.getElementById('signupDiv').style.display = "none";
   document.getElementById('loginDiv').style.display = "flex";
   document.getElementById('showLoginBtn').style.backgroundColor = "#f5d45d";
   document.getElementById('showSignupBtn').style.backgroundColor = "#FFFFFF";
}

function displaySignup(){
   sessionStorage.setItem('login', 2);
   document.getElementById('resetDiv').style.display = "none";
   document.getElementById('signupDiv').style.display = "flex";
   document.getElementById('loginDiv').style.display = "none";
   document.getElementById('showLoginBtn').style.backgroundColor = "#FFFFFF";
   document.getElementById('showSignupBtn').style.backgroundColor = "#f5d45d";
}

document.getElementById('loginBtn').addEventListener("click", function(){
   startLoader();
   unsubscribe();
   localStorage.clear();
   sessionStorage.clear();
    var email = document.getElementById("userEmailLog").value;
    var password  = document.getElementById("userPassLog").value;
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        window.open('https://damuword.kz/account', '_self');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        stopLoader();
        alert(errorCode + ' -- ' + errorMessage + '\r\n Please, contact us if you have questions!');
    });
});

document.getElementById('register').addEventListener("click", function(){
   startLoader();
   unsubscribe();
   localStorage.clear();
   sessionStorage.clear();
   var email = document.getElementById("userEmailReg").value;
   var password = document.getElementById("userPassReg").value;
   auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      var user = userCredential.user;

      db.collection("damuword").doc(user.uid).set({
         quote: "Your future depends on what you do today."
      }).then(() => {
         user.updateProfile({
            displayName: document.getElementById("userNameReg").value
         }).then(() => {
            window.open('https://damuword.kz/account', '_self');
         });
      });
   }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      stopLoader();
      alert(errorCode + ' -- ' + errorMessage + '\r\n Please, contact us if you have questions!');
   });
});

document.getElementById("forgetPass").addEventListener("click", function(){
   document.getElementById('resetDiv').style.display = "flex";
   document.getElementById('loginDiv').style.display = "none";
   document.getElementById('showLoginBtn').style.backgroundColor = "#FFFFFF";
});

document.getElementById('reset').addEventListener("click", function(){
   var email = document.getElementById('userEmailRes').value;
   auth.sendPasswordResetEmail(email).then(() => {
      alert("Password reset email was sent to your email!");
   }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      displayLogin();
      alert(errorCode + ' -- ' + errorMessage + '\nPlease, contact us if you have questions!');
   });
});