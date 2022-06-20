import {analytics, auth, db, storage} from '/fb_links.js';

function createSet(){
   localStorage.clear();
   window.open('https://damuword.kz/write/', '_self');
}

function startSet(){
   var arrIndex = new Array();
   var arrName = new Array();
   db.collection("damuword").doc(uid).get().then((doc) => {
      if (doc.data().index) {
         arrIndex = doc.data().index;
         arrName = doc.data().name;

         for (var i = 0; i < arrIndex.length; i++) {
            addSet(arrIndex[i], arrName[i]);
         }
      }
   });
}

function addSet(index, name){
   db.collection("damuword/"+uid+"/"+index).get().then((collection) => {
      var i = 0;
      var text = " ";
      while ((i < collection.size) && (i < 4)) {
         text = text + collection.docs[i].data().word + ", ";
         i++;
      }
      text = text + "...";
      document.getElementById("sets").insertAdjacentHTML('beforeend', '<div class="col-6 col-md-6 col-lg-4"><div class="card" id="'+index+'" onclick="openSet(this.id)"><div class="card-body"><h5 class="card-title">'+name+'</h5><p class="set-text card-text" style="font-size:12px;">'+text+'</p></div></div></div>');
   });
}

function openSet(id){
   localStorage.setItem("idOfSet", id);
   window.open('https://damuword.kz/write/', '_self');
}