var partOfSpeeches = new Array(6);
partOfSpeeches[0] = 'noun';
partOfSpeeches[1] = 'verb';
partOfSpeeches[2] = 'adjective';
partOfSpeeches[3] = 'adverb';
partOfSpeeches[4] = 'phrasal-verb';
partOfSpeeches[5] = 'other';

var db = firebase.firestore();
var uid;

var defaultWidth = 60;
var definitionType = 'normal', definitionSize = 10;
var exampleType = 'italic', exampleSize = 10;

var numberOfWords = 0;
var pathToSet;

getUID();

function getUID(){
   startLoader();
   auth.onAuthStateChanged((user) => {
      if (user) {
         uid = user.uid;
      } else {
         uid = "guests";
      }
      openSet();
   });
}

function openSet(){
   if (!localStorage.getItem("idOfSet")) {
      var idOfSet = getRandomId();
      localStorage.setItem("idOfSet", idOfSet);
      pathToSet = "tenwords/"+uid+"/"+localStorage.getItem("idOfSet");
      draftPage();
      if (uid != "guests") {
         setNameOfSet(idOfSet);
         document.getElementById("setName").style.display = "flex";
      } else {
         document.getElementById("setName").style.display = "none";
      }
   } else {
      var idOfSet = localStorage.getItem("idOfSet");
      pathToSet = "tenwords/"+uid+"/"+idOfSet;
      if (uid != "guests") {
         getNameOfSet(idOfSet);
      }
      setAllData();
   }
}

function getRandomId() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 20; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

function getNameOfSet(idOfSet){
   db.collection("tenwords").doc(uid).get().then((doc) => {
      var arrIndex = new Array();
      var arrName = new Array();
      arrIndex = doc.data().index;
      arrName = doc.data().name;
      var i = 0;
      while (true) {
         if (arrIndex[i] == idOfSet) {
            document.getElementById("setNameInput").value = arrName[i];
            break;
         } else {
            i++;
         }
      }
   });
}

function setNameOfSet(idOfSet){
   document.getElementById("setNameInput").value = "Draft";

   db.collection("tenwords").doc(uid).get().then((doc) => {
      var arrIndex = new Array();
      var arrName = new Array();

      if (doc.data().index) {
         arrIndex = doc.data().index;
         arrName = doc.data().name;

         arrIndex.push(idOfSet.toString());
         arrName.push("Draft");
      } else {
         arrIndex[0] = idOfSet.toString();
         arrName[0] = "Draft";
      }
      db.collection("tenwords").doc(uid).update({
         index: arrIndex,
         name: arrName
      });
   });
}

function changeNameOfSet(){
   db.collection("tenwords").doc(uid).get().then((doc) => {
      var arrIndex = new Array();
      var arrName = new Array();

      arrIndex = doc.data().index;
      arrName = doc.data().name;

      var i = 0;
      var idOfSet = localStorage.getItem("idOfSet");
      while (true) {
         if (arrIndex[i] == idOfSet) {
            arrName[i] = document.getElementById("setNameInput").value;
            break;
         } else {
            i++;
         }
      }

      db.collection("tenwords").doc(uid).update({
         index: arrIndex,
         name: arrName
      });
   });
}

function draftPage(){
   db.collection(pathToSet).add({
      word: "Welcome"
   }).then((snapshot) => {
      db.collection(pathToSet+"/"+snapshot.id+"/noun").add({
         def: "",
         exp: ""
      });

      db.collection(pathToSet+"/"+snapshot.id+"/noun").add({
         def: "",
         exp: ""
      });
   });

   db.collection(pathToSet).add({
      word: ""
   }).then((snapshot) => {
      db.collection(pathToSet+"/"+snapshot.id+"/verb").add({
         def: "",
         exp: ""
      });

      db.collection(pathToSet+"/"+snapshot.id+"/verb").add({
         def: "",
         exp: ""
      });
      setAllData();
   });
}

function setAllData(){
   sessionStorage.setItem("orderOfWord", 0);
   db.collection(pathToSet).get().then((collection) => {
      collection.docs.forEach(doc => {
         addFieldOfWord(doc.id);

         document.getElementById(doc.id).value = doc.data().word;

         for (var i = 0; i < partOfSpeeches.length; i++) {
            db.collection(pathToSet+"/"+doc.id+"/"+partOfSpeeches[i]).get().then((collection) => {
               var numberOfDef = collection.size;
               if(numberOfDef > 0){
                  var idOfWord = collection.docs[0].ref.parent.parent.id;
                  var partOfSpeech = collection.docs[0].ref.parent.id;

                  addFieldOfPartOfSpeech(idOfWord, partOfSpeech);

                  var newIdOfBox = idOfWord+'_'+partOfSpeech;
                  document.getElementById(newIdOfBox).checked = true;

                  collection.docs.forEach(doc => {
                     addFieldOfDefinition(doc.ref.parent.parent.id, doc.ref.parent.id, doc.id);

                     var idOfDef = doc.ref.parent.parent.id.toString()+'/'+doc.ref.parent.id+'/'+doc.id.toString()+'_def';
                     var idOfEx = doc.ref.parent.parent.id.toString()+'/'+doc.ref.parent.id+'/'+doc.id.toString()+'_exp';

                     document.getElementById(idOfDef).value = doc.data().def;
                     document.getElementById(idOfEx).value = doc.data().exp;

                     setNumberOfLines(doc.ref.parent.parent.id);
                  });
               }
            });
         }
      });
   }).then(() => {
      stopLoader();
   });
}

function addFieldOfWord(idOfWord){
    var newIdOfField = idOfWord+'_field';
    var newIdOfCounter = idOfWord+'_counter';
    var newIdToDelete = "'"+idOfWord+"'";

    var htmlOfCheckBox = '<div class="checkbox-field d-flex justify-content-sm-between flex-wrap justify-content-evenly">';
    for(var i=0; i<partOfSpeeches.length; i++){
        var newIdOfBox = idOfWord+'_'+partOfSpeeches[i];
        htmlOfCheckBox += '<span><input type="checkbox" class="checkBox" id="'+newIdOfBox+'" onclick="addOrDeletePartOfSpeech(event)"><label for="'+newIdOfBox+'">'+partOfSpeeches[i]+'</label></span>';
    }
    htmlOfCheckBox += '</div>';

    var orderOfWord = parseInt(sessionStorage.getItem("orderOfWord")) + 1;
    sessionStorage.setItem("orderOfWord", orderOfWord);

    document.getElementById('start').insertAdjacentHTML('beforeend', '<div class=" container-fluid d-flex flex-column align-items-center word-div" id="'+newIdOfField+'"><div class="word-disc container-fluid"><span name="order">'+orderOfWord+'. Enter the word: </span><span class="input-mobile"><input type="text" id="'+idOfWord+'" name="words" oninput="saveWord(event)" class="wordName" maxlength="15"><button class="c-button delete-word delete-word-mobile" onclick="deleteWord('+newIdToDelete+')"></button></span><span title="Number of lines used in the card" id="'+newIdOfCounter+'" class="counter" style="color: black;">1/16 lines</span><button class="c-button delete-word delete-word-desktop mx-1" onclick="deleteWord('+newIdToDelete+')"></button></div>'+htmlOfCheckBox+'</div>');
}

function addFieldOfPartOfSpeech(idOfWord, partOfSpeech){
    var idOfFieldAppear = idOfWord+'_field';
    var newIdOfField = idOfWord+'_'+partOfSpeech+'_field';
    var newDataToAddDef = "'"+idOfWord+"', '"+partOfSpeech+"'";
    document.getElementById(idOfFieldAppear).insertAdjacentHTML('beforeend', '<div class="def-exp" id="'+newIdOfField+'"><div class="def-span"><span style="margin: 0 5px; font-size: 16px;">'+partOfSpeech+'</span><button class="c-button add-def-btn" title="Add new definition and example" onclick="addNewDefinition('+newDataToAddDef+')"></button></div></div>');

    setNumberOfLines(idOfWord);
}

function addFieldOfDefinition(idOfWord, partOfSpeech, idOfDef){
    var idOfFieldAppear = idOfWord+'_'+partOfSpeech+'_field';
    var newIdOfField = idOfWord+'_'+partOfSpeech+'_'+idOfDef+'_field';
    var newDataToDelete = "'"+idOfWord+"', '"+partOfSpeech+"', '"+idOfDef+"'";

    var newIdOfDef = idOfWord+'/'+partOfSpeech+'/'+idOfDef+'_def';
    var newIdOfExp = idOfWord+'/'+partOfSpeech+'/'+idOfDef+'_exp';

    document.getElementById(idOfFieldAppear).insertAdjacentHTML('beforeend', '<div class="def-exp-part d-flex align-items-center justify-content-center" id="'+newIdOfField+'"><textarea placeholder="definition" id="'+newIdOfDef+'" oninput="saveTextAreaDef(event)"></textarea><textarea placeholder="example" id="'+newIdOfExp+'"oninput="saveTextAreaExp(event)"></textarea><button  title="Delete definition and example" class="c-button delete-def-btn" onclick="deleteDefinition('+newDataToDelete+')"></button></div>');
}

function addNewWord(){
   db.collection(pathToSet).add({
      word: ""
   }).then((doc) => {
      addFieldOfWord(doc.id);
   });
}

function addOrDeletePartOfSpeech(event){
   var id = event.target.id;
   var idOfWord = id.slice(0, 20);
   var partOfSpeech = id.slice(21, id.length);

   if(event.target.checked == true){
      addFieldOfPartOfSpeech(idOfWord, partOfSpeech);
      addNewDefinition(idOfWord, partOfSpeech);
   } else {
      deletePartOfSpeech(idOfWord, partOfSpeech);
   }
}

function addNewDefinition(idOfWord, partOfSpeech){
   db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeech).add({
      def: "",
      exp: ""
   }).then(doc => {
      addFieldOfDefinition(idOfWord, partOfSpeech, doc.id);
      setNumberOfLines(idOfWord);
   });
}


function deleteWord(idOfWord){
   for (var i = 0; i < partOfSpeeches.length; i++) {
      var idOfBox = idOfWord+"_"+partOfSpeeches[i];
      if(document.getElementById(idOfBox).checked == true){
         db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeeches[i]).get().then((collection) => {
            collection.docs.forEach(doc => {
               doc.ref.delete();
            });
         });
      }
   }

   db.collection(pathToSet).doc(idOfWord).delete();
   document.getElementById(idOfWord+'_field').remove();

   var orderOfWord = parseInt(sessionStorage.getItem("orderOfWord")) - 1;
   sessionStorage.setItem("orderOfWord", orderOfWord);

   var orders = document.getElementsByName('order');
   var i = 0;
   while(i+1 == parseInt(orders[i].innerHTML.slice(0, 1))) {
      i++;
   }
   for (var j = i; j < orderOfWord; j++) {
      orders[j].innerHTML = (j+1) + ". Enter the word: ";
   }
}

function deletePartOfSpeech(idOfWord, partOfSpeech){
       db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeech).get().then(collection => {
          collection.docs.forEach(doc => {
             doc.ref.delete();
             setNumberOfLines(idOfWord);
          });
       });
       document.getElementById(idOfWord+'_'+partOfSpeech+'_field').remove();
}

function deleteDefinition(idOfWord, partOfSpeech, idOfDef){
   db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeech).doc(idOfDef).delete().then(() => {
      db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeech).get().then((collection) => {
         if(collection.size == 0){
            var idOfCheckBox = idOfWord+'_'+partOfSpeech;
            document.getElementById(idOfCheckBox).checked = false;
            deletePartOfSpeech(idOfWord, partOfSpeech);
         }
         setNumberOfLines(idOfWord);
      });
   });

   document.getElementById(idOfWord+'_'+partOfSpeech+'_'+idOfDef+'_field').remove();
}


function saveWord(event){
   db.collection(pathToSet).doc(event.target.id).update({
      word: event.target.value
   });
}

function saveTextAreaDef(event){
   var id = event.target.id;
   id = id.slice(0, id.length-4);
   db.collection(pathToSet).doc(id).update({
      def: event.target.value
   }).then(() => {
      setNumberOfLines(id.slice(0, 20));
   });
}

function saveTextAreaExp(event){
   var id = event.target.id;
   id = id.slice(0, id.length-4);
   db.collection(pathToSet).doc(id).update({
      exp: event.target.value
   }).then(() => {
      setNumberOfLines(id.slice(0, 20));
   });
}


function setNumberOfLines(idOfWord){
    var numberOfLines = 0;
    for(var i=0; i<partOfSpeeches.length; i++){
        var idOfPartOfSpeech = idOfWord+'_'+partOfSpeeches[i];
        if(document.getElementById(idOfPartOfSpeech).checked == true){
           numberOfLines++;
           var ele = document.getElementById(idOfPartOfSpeech+"_field").getElementsByTagName("textarea");
           for(var j=0; j<ele.length; j=j+2){

               var txtDef = ele[j].value;
               var txtExp = ele[j+1].value;

               numberOfLines += numberOfLinesOfText(txtDef, definitionType, definitionSize) + numberOfLinesOfText(txtExp, exampleType, exampleSize);
           }
        }
    }

    var idOfCounter = idOfWord+'_counter';
    var text = numberOfLines+'/16 lines';
    document.getElementById(idOfCounter).innerHTML = text;
    sessionStorage.removeItem('checkCounter');
    if(numberOfLines > 16) {
           document.getElementById(idOfCounter).style.color = 'red';
           sessionStorage.setItem('checkCounter', 'red');
    }
    else {
           document.getElementById(idOfCounter).style.color = 'black';
    }

}

function numberOfLinesOfText(text, type, size){
    var lines = 0;
    if (text != '') {
      if (type == "normal") {
         text = "- "+text;
      }
        var remainingText = text;
        lines++;
        while(getWidth(remainingText, type, size) > defaultWidth){
            lines++;
            var indexOfBreak = findBreak(remainingText, type, size);
            text = remainingText.slice(0, indexOfBreak);
            remainingText = remainingText.slice(indexOfBreak+1, remainingText.length);
        }
    }
    return lines;
}

function findBreak(text, type, size){
    var indexOfBreak = 30;
    var indexOfSpace = text.indexOf(' ');
    if (indexOfSpace != -1){
        var firstPartOfText = text.slice(0, indexOfSpace);
        var secondPartOfText = text.slice(indexOfSpace+1, text.length);
        while(getWidth(firstPartOfText, type, size) <= defaultWidth){
            indexOfBreak = indexOfSpace;
            if(secondPartOfText.indexOf(' ') == -1){
                indexOfSpace = text.length;
            } else {
                indexOfSpace = indexOfSpace + secondPartOfText.indexOf(' ') + 1;
            }
            firstPartOfText = text.slice(0, indexOfSpace);
            secondPartOfText = text.slice(indexOfSpace+1, text.length);
        }
    }
    return indexOfBreak;
}


function deleteSet(){
   if(confirm('Do you really want to delete everything?')){
      startLoader();
      db.collection("tenwords").doc(uid).get().then((doc) => {
         var arrIndex = new Array();
         var arrName = new Array();

         arrIndex = doc.data().index;
         arrName = doc.data().name;

         var j = 0;
         var idOfSet = localStorage.getItem("idOfSet");
         while (true) {
            if (arrIndex[j] == idOfSet) {
               arrName.splice(j, 1);
               arrIndex.splice(j, 1);
               break;
            } else {
               j++;
            }
         }

         console.log(arrName);

         db.collection("tenwords").doc(uid).update({
            index: arrIndex,
            name: arrName
         }).then(() => {
            db.collection(pathToSet).get().then((collection) => {
               collection.docs.forEach(doc => {
                  var idOfWord = doc.id;
                  for (var i = 0; i < partOfSpeeches.length; i++) {
                     var idOfBox = idOfWord+"_"+partOfSpeeches[i];
                     if(document.getElementById(idOfBox).checked == true){
                        db.collection(pathToSet+"/"+idOfWord+"/"+partOfSpeeches[i]).get().then((collection) => {
                           collection.docs.forEach(doc => {
                              doc.ref.delete();
                           });
                        });
                     }
                  }
                  db.collection(pathToSet).doc(idOfWord).delete();
               });
            }).then(() => {
               localStorage.clear();
               sessionStorage.clear();
               window.open('https://tenwords.kz/account/', '_self');
            });
         });
      });
   }
}


function download(){
    var filename = document.getElementById('setNameInput').value + '.txt';
    var text = convertToText();

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}

function convertToText(){
   var space = '%-%';
   var enter = '$-$';

   var words = document.getElementsByName('words');
   var text = words.length.toString()+enter;
   for (var k = 0; k < words.length; k++) {
      text = text + words[k].value + space;
      var idOfWord = words[k].id;
      for (var i = 0; i < partOfSpeeches.length; i++) {
         var idOfBox = idOfWord+"_"+partOfSpeeches[i];
         if (document.getElementById(idOfBox).checked == true) {
            text = text + partOfSpeeches[i] + space;

            var ele = document.getElementById(idOfWord+"_field").getElementsByTagName("textarea");

            text = text + ele.length/2 + space;

            for(var j=0; j<ele.length; j=j+2){

                var txtDef = ele[j].value;
                var txtExp = ele[j+1].value;

                text = text + txtDef + space;
                text = text + txtExp + space;
            }
         }
      }
      text = text + enter;
   }
   return text;
}
