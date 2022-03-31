function createSet(){
   localStorage.clear();
   window.open('https://tenwords.kz/write/', '_self');
}

function startSet(){
   var arrIndex = new Array();
   var arrName = new Array();
   db.collection("tenwords").doc(uid).get().then((doc) => {
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
   db.collection("tenwords/"+uid+"/"+index).get().then((collection) => {
      var i = 0;
      var text = " ";
      while ((i < collection.size) && (i < 4)) {
         text = text + collection.docs[i].data().word + ", ";
         i++;
      }
      text = text + "...";
      document.getElementById("sets").insertAdjacentHTML('beforeend', '<div class="sets" data-index="'+index+'" data-name="'+name+'" id="'+index+'" onclick="openSet(this.id)"><h3 class="sets-heading">'+name+'</h3><p class="sets-paragraph">'+text+'</p></div>');
   });
}

function openSet(id){
   localStorage.setItem("idOfSet", id);
   window.open('https://tenwords.kz/write/', '_self');
}
