const express = require('express')
const fs = require('fs')

const app = express()
const port = 3003

app.listen(port, console.log(`server started on port ${port}`))

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get(["/", "/index", "/home"], function (req, res) {
   console.log("ceva")

   res.render("index", {ip: req.ip, ceva: 10, altceva: 2})
});

app.get("/*",function(req, res){
   console.log("url:",req.url);
   //res.sendFile(__dirname+ "/index.html");
   //res.write("nu stiu");
   //res.end();
   res.render("pagini"+req.url, function(err,rezRandare){
      //console.log("Eroare", err);
      //console.log("Rezultat randare", rezRandare);

      if(err){
         if(err.message.includes("Failed to lookup view")){
            renderError(res,404,"titlu custom");
         }
         else{

         }
      }
      else{
         res.send(rezRandare);
      }


   });
});

app.get("/*.ejs",function(req, res){
   renderError(res,403);
});


obGlobal = {
   erori: null
}

function createErrors() {
   let continutFisier = fs.readFileSync(__dirname + '/public/resurse/json/erori.json').toString("utf8")
   //console.log(continutFisier)
   obGlobal.erori = JSON.parse(continutFisier)
   //console.log(obGlobal.erori)
}
createErrors()

function renderError(res, identificator, titlu, text, imagine) {
   let eroare = obGlobal.erori.info_erori.find(elem => elem.identificator === identificator)

   titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu
   text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text
   imagine = imagine || (eroare && eroare.imagine) || obGlobal.erori.eroare_default.imagine

   if (eroare && eroare.status) {
      res.status(eroare.identificator).render("eroare", {titlu: titlu, text: text, imagine: imagine})
   } else {
      res.render("eroare", {titlu: titlu, text: text, imagine: imagine})
   }
}