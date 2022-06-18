var storage = firebase.storage();
var db = firebase.firestore();
var uid;

var enter = '$-$';
var space = '%-%';
var numberOfWords;
var pathToSet;

function createSet() {
   auth.onAuthStateChanged((user) => {
       if (user) {
           localStorage.clear();
           window.open("https://damuword.kz/write/", "_self");
       } else {
           window.open("https://damuword.kz/write/", "_self");
       }
   });
}

createPath();

function createPath(){
   auth.onAuthStateChanged((user) => {
      if (user) {
         uid = user.uid;
      } else {
         uid = "guests";
      }
   });
}

var readFile = function(event){
   var file = event.target.files[0];
   var reader = new FileReader();
   reader.readAsText(file);

   var nameOfSet = file.name.slice(0, file.name.length-4);

   reader.onload = function(){
      var text = reader.result;
      readSet(text, nameOfSet);
   }
}

function openReadySet(name){
   startLoader();
   storage.ref('sets/'+name+'.txt').getDownloadURL().then(url => {
       fetch(url).then(function(response) {
           response.text().then(function(text) {
             readSet(text, name);
           });
       });
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode + ' -- ' + errorMessage);
    });
}

function readSet(text, name){
   startLoader();
   var idOfSet = getRandomId();
   setNameOfSet(idOfSet, name);
   localStorage.setItem("idOfSet", idOfSet);
   pathToSet = "damuword/"+uid+"/"+localStorage.getItem("idOfSet");

   var index = text.indexOf(enter);
   numberOfWords = text.slice(0, index);
   text = text.slice(index+3, text.length);

    if(isNaN(numberOfWords)){
        alert("Something went wrong! Try another file...");
    } else {
      var words = new Words();
      for (var i = 0; i < numberOfWords; i++) {
         index = text.indexOf(enter);
         var e = text.slice(0, index);
         text = text.slice(index+3, text.length);

         words.newWord(e);
      }
      storeSet(words);
    }
}

function storeSet(words){
   sessionStorage.setItem("numberOfWords", 0);
   for (var i = 0; i < numberOfWords; i++) {
      var word = words.getWord(i);
      storeWord(word);
   }
}

function storeWord(word){
   db.collection(pathToSet).add({
      word: word.word
   }).then((snapshot) => {
      var partOfSpeeches = word.partOfSpeeches;
      var a1 = 1, a2 = 1, a3 = 1, a4 = 1, a5 = 1, a6 = 1;

      if (partOfSpeeches[0] == 'true') {
         for (var i = 0; i < word.nounDef.length; i++) {
            a1 = db.collection(pathToSet+"/"+snapshot.id+"/noun").add({
               def: word.nounDef[i],
               exp: word.nounExp[i]
            });
         }
      }

      if (partOfSpeeches[1] == 'true') {
         for (var i = 0; i < word.verbDef.length; i++) {
            a2 = db.collection(pathToSet+"/"+snapshot.id+"/verb").add({
               def: word.verbDef[i],
               exp: word.verbExp[i]
            });
         }
      }

      if (partOfSpeeches[2] == 'true') {
         for (var i = 0; i < word.adjectiveDef.length; i++) {
            a3 = db.collection(pathToSet+"/"+snapshot.id+"/adjective").add({
               def: word.adjectiveDef[i],
               exp: word.adjectiveExp[i]
            });
         }
      }

      if (partOfSpeeches[3] == 'true') {
         for (var i = 0; i < word.adverbDef.length; i++) {
            a4 = db.collection(pathToSet+"/"+snapshot.id+"/adverb").add({
               def: word.adverbDef[i],
               exp: word.adverbExp[i]
            });
         }
      }

      if (partOfSpeeches[4] == 'true') {
         for (var i = 0; i < word.phrasalDef.length; i++) {
            a5 = db.collection(pathToSet+"/"+snapshot.id+"/phrasal-verb").add({
               def: word.phrasalDef[i],
               exp: word.phrasalExp[i]
            });
         }
      }

      if (partOfSpeeches[5] == 'true') {
         for (var i = 0; i < word.otherDef.length; i++) {
            db.collection(pathToSet+"/"+snapshot.id+"/other").add({
               def: word.otherDef[i],
               exp: word.otherExp[i]
            });
         }
      }

      Promise.all([a1, a2, a3, a4, a5, a6]).then(() => {
         if (parseInt(sessionStorage.getItem("numberOfWords"))+1 == numberOfWords) {
            stopLoader();
            window.open('https://damuword.kz/write/', '_self');
         } else {
            var t = parseInt(sessionStorage.getItem("numberOfWords"))+1;
            sessionStorage.setItem("numberOfWords", t);
         }
      });
   });
}

function setNameOfSet(idOfSet, nameOfSet){
   db.collection("damuword").doc(uid).get().then((doc) => {
      var arrIndex = new Array();
      var arrName = new Array();

      if (doc.data().index) {
         arrIndex = doc.data().index;
         arrName = doc.data().name;

         arrIndex.push(idOfSet.toString());
         arrName.push(nameOfSet);
      } else {
         arrIndex[0] = idOfSet.toString();
         arrName[0] = nameOfSet;
      }
      db.collection("damuword").doc(uid).update({
         index: arrIndex,
         name: arrName
      });
   });
}

class Word{
   constructor(text){
      var index = text.indexOf(space);
      this.word = text.slice(0, index);
      text = text.slice(index+3, text.length);

      this.partOfSpeeches = new Array(6);

      while (text != "") {
         index = text.indexOf(space);
         var speech = text.slice(0, index);
         text = text.slice(index+3, text.length);

         if (speech == "noun") {
            this.partOfSpeeches[0] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.nounDef = new Array(numberOfDef);
            this.nounExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.nounDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.nounExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }

         if (speech == "verb") {
            this.partOfSpeeches[1] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.verbDef = new Array(numberOfDef);
            this.verbExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.verbDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.verbExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }

         if (speech == "adjective") {
            this.partOfSpeeches[2] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.adjectiveDef = new Array(numberOfDef);
            this.adjectiveExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.adjectiveDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.adjectiveExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }

         if (speech == "adverb") {
            this.partOfSpeeches[3] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.adverbDef = new Array(numberOfDef);
            this.adverbExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.adverbDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.adverbExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }

         if (speech == "phrasal") {
            this.partOfSpeeches[4] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.phrasalDef = new Array(numberOfDef);
            this.phrasalExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.phrasalDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.phrasalExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }

         if (speech == "other") {
            this.partOfSpeeches[5] = 'true';
            index = text.indexOf(space);
            var numberOfDef = text.slice(0, index);
            text = text.slice(index+3, text.length);

            this.otherDef = new Array(numberOfDef);
            this.otherExp = new Array(numberOfDef);

            for (var i = 0; i < numberOfDef; i++) {
               index = text.indexOf(space);
               this.otherDef[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);

               index = text.indexOf(space);
               this.otherExp[i] = text.slice(0, index);
               text = text.slice(index+3, text.length);
            }
         }
      }
   }
}

class Words {
  constructor(){
    this.words = [];
  }

  newWord(text){
    var w = new Word(text);
    this.words.push(w);
  }

  getWord(n){
     return this.words[n];
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

