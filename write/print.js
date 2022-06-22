function print(){
   if(sessionStorage.getItem('checkCounter') == "red"){
          alert('Please check every word, the number of characters is too big');
   }
   else {
     downloadPDF();
   }
}

function downloadPDF(){
  pdf = new jsPDF();
  var words = document.getElementsByName('words');

  prepareAllPages(words.length);

  for (var i = 0; i < words.length; i++) {
     var orderOfWord = i%12;
     var orderOfPage = 2*parseInt(i/12);
     setWord(orderOfPage+1, orderOfWord, words[i].value);
     var textPOS = "";
     var orderOfLine = 1;
     for (var j = 0; j < partOfSpeeches.length; j++) {
        var idOfBox = words[i].id + "_" + partOfSpeeches[j];
        if (document.getElementById(idOfBox).checked == true) {
           textPOS = textPOS + partOfSpeeches[j] + ", ";

           orderOfLine = setPOSBack(orderOfPage+2, orderOfWord, partOfSpeeches[j], orderOfLine);

           var ele = document.getElementById(idOfBox+"_field").getElementsByTagName("textarea");
           for (var k = 0; k < ele.length; k = k+2) {
              var textDef = ele[k].value;
              orderOfLine = setDefinition(orderOfPage+2, orderOfWord, textDef, orderOfLine);

              var textExp = ele[k+1].value;
              orderOfLine = setExample(orderOfPage+2, orderOfWord, textExp, orderOfLine);
           }
        }
     }
     textPOS = textPOS.slice(0, textPOS.length-2);
     setPOSFront(orderOfPage+1, orderOfWord, textPOS);
  }

  var fileName = 'damuword_' + document.getElementById("setNameInput").value + '.pdf';
  pdf.save(fileName);
}

function setWord(page, order, word){
  pdf.setPage(page);

  var y = parseInt(order/3);
  var x = order - 3*y;
  y = y*72+38 + getWidth(word, 'normal', 20)/2;
  x = x*67+30;

  pdf.setFontType('normal');
  pdf.setTextColor(0,0,0);
  pdf.setFontSize(20);
  pdf.text(word, x, y, 90);
}

function setPOSFront(page, order, partOfSpeech){
  pdf.setPage(page);

  var y = parseInt(order/3);
  var x = order - 3*y;
  y = y*72 + 38 + getWidth(partOfSpeech, 'normal', 10)/2;
  x = x*67 + 50;

  pdf.setFontType('normal');
  pdf.setTextColor(0,0,0);
  pdf.setFontSize(10);
  pdf.text(partOfSpeech, x, y, 90);
}

function setPOSBack(page, order, partOfSpeech, line){
  pdf.setPage(page);

  var y = parseInt(order/3);
  var x = order - 3*y;
  y = y*72 + 74;
  x = (2-x)*67 + 4 + 4*line;

  pdf.setFontType('bold');
  pdf.setTextColor(0,0,0);
  pdf.setFontSize(10);
  pdf.text(partOfSpeech, x, y, 90);

  return line+1;
}

function setDefinition(page, order, text, line){
  if (text) {
     text = "- "+text;

     pdf.setPage(page);

     var y = parseInt(order/3);
     var x = order - 3*y;
     y = y*72 + 74;
     x = (2-x)*67 + 4 + 4*line;

     pdf.setFontType('normal');
     pdf.setTextColor(0,0,0);
     pdf.setFontSize(10);

     var remText = text;
     while (getWidth(remText, 'normal', 10) > defaultWidth) {
        var indexOfBreak = findBreak(remText, 'normal', 10);
        text = remText.slice(0, indexOfBreak);
        pdf.text(text, x, y, 90);
        line++;
        x = x+4;
        remText = remText.slice(indexOfBreak+1, remText.length);
     }
     pdf.text(remText, x, y, 90);

     return line+1;
  } else {
     return line;
  }

}

function setExample(page, order, text, line){
  if (text) {
     pdf.setPage(page);

     var y = parseInt(order/3);
     var x = order - 3*y;
     y = y*72 + 74;
     x = (2-x)*67 + 4 + 4*line;

     pdf.setFontType('italic');
     pdf.setTextColor(0,0,0);
     pdf.setFontSize(10);

     var remText = text;
     while (getWidth(remText, 'italic', 10) > defaultWidth) {
        var indexOfBreak = findBreak(remText, 'italic', 10);
        text = remText.slice(0, indexOfBreak);
        pdf.text(text, x, y, 90);
        line++;
        x = x+4;
        remText = remText.slice(indexOfBreak+1, remText.length);
     }
     pdf.text(remText, x, y, 90);

     return line+1;
  } else {
     return line;
  }

}

function prepareAllPages(numberOfWords){
  var numberOfPages = parseInt(numberOfWords/12);
  if(numberOfWords/12 > numberOfPages){
     numberOfPages++;
  }

   for(var i=2; i<=(2*numberOfPages); i++){
       pdf.addPage();
   }
   for(var i=1; i<=2*numberOfPages; i++){
       pdf.setPage(i);
       pdf.setLineWidth(0.5);
       pdf.line(4, 4, 205, 4);
       pdf.line(4, 76, 205, 76);
       pdf.line(4, 148, 205, 148);
       pdf.line(4, 220, 205, 220);
       pdf.line(4, 292, 205, 292);

       pdf.line(4, 4, 4, 292);
       pdf.line(71, 4, 71, 292);
       pdf.line(138, 4, 138, 292);
       pdf.line(205, 4, 205, 292);
   }
}