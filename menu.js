import {analytics, auth, db, storage} from '/fb_links.js';

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