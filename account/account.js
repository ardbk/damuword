import {analytics, auth, db, storage} from '/fb_links.js';

var uid;

start();

function start(){
   startLoader();
   auth.onAuthStateChanged((user) => {
      if (user) {
         uid = user.uid;
         document.getElementById("userName").innerHTML = user.displayName;
         document.getElementById("userEmail").innerHTML = user.email;
         setProfileImage();
         db.collection("damuword").doc(uid).get().then((doc) => {
            document.getElementById("userQuote").innerHTML = doc.data().quote;
         });
         startSet();
      } else {
         window.open('https://damuword.kz', '_self');
      }
   });
}

function setProfileImage(){
   storage.ref('profilePictures/'+uid).listAll().then((res) => {
      if (res.items[0]) {
         res.items[0].getDownloadURL().then((url) => {
            document.getElementById("userImage").src = url;
         });
      } else {
         storage.ref('profilePictures/default/account.png').getDownloadURL().then((url) => {
            document.getElementById("userImage").src = url;
         });
      }
      stopLoader();
   });
}

function openSettings(){
   document.getElementById('settings').style.display = "flex";
   document.getElementById('body').style.display = "none";

   document.getElementById('setUserName').value = document.getElementById("userName").innerHTML;
   document.getElementById('setUserQuote').value = document.getElementById("userQuote").innerHTML;
}

function closeSettings(){
   user = auth.currentUser;
   document.getElementById('settings').style.display = "none";
   document.getElementById('body').style.display = "block";

   var oldUserName = document.getElementById("userName").innerHTML;
   var newUserName = document.getElementById('setUserName').value;
   var oldUserQuote = document.getElementById("userQuote").innerHTML;
   var newUserQuote = document.getElementById('setUserQuote').value;

   if (oldUserName != newUserName) {
      user.updateProfile({
         displayName: newUserName
      }).then(() => {
         document.getElementById("userName").innerHTML = user.displayName;
      }).catch((error) => {
         var errorCode = error.code;
         var errorMessage = error.message;
         alert( 'Unable to update user name. \n' + errorCode + ' -- ' + errorMessage);
      });
   }

   if (oldUserQuote != newUserQuote) {
      db.collection("damuword").doc(uid).update({
         quote: newUserQuote
      }).then(() => {
         document.getElementById("userQuote").innerHTML = newUserQuote;
      }).catch((error) => {
         var errorCode = error.code;
         var errorMessage = error.message;
         alert( 'Unable to update quote. \n' + errorCode + ' -- ' + errorMessage);
      });
   }

   var file = document.getElementById("setUserFile").files[0];
   if (file) {
      storage.ref('profilePictures/'+uid).listAll().then((res) => {
         if (res.items[0]) {
            res.items[0].delete().then(() => {
               storage.ref('profilePictures/'+uid+'/'+file.name).put(file).then(() => {
                  setProfileImage();
               });
            });
         } else {
            storage.ref('profilePictures/'+uid+'/'+file.name).put(file).then(() => {
               setProfileImage();
            });
         }
      });
   }
}

function openPage(page){
   if (page == 'account'){
      window.open('https://damuword.kz/account/', "_self");
   } else if (page == 'login') {
      sessionStorage.setItem('login', 1);
      window.open('https://damuword.kz/login/', "_self");
   } else if (page == 'signup') {
      sessionStorage.setItem('login', 2);
      window.open('https://damuword.kz/login/', "_self");
   }
}

function signOut(){
   localStorage.clear();
   auth.signOut().then(() => {
      window.open('https://damuword.kz', "_self");
   });
}

function fileName(){
   var file = document.getElementById("setUserFile").files[0];
   document.getElementById("fileName").innerHTML = file.name;
}
