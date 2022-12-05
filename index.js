const express = require('express')
const fs = require('fs')

const app = express()
const port = 3000

app.listen(port, console.log(`server started on port ${port}`))

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get(["/", "/index", "/home"], (req, res) => {
   res.render("pagini/index", {
      ip: req.ip,
      ceva: 10,
      altceva: 2
   })
})

app.get("/*" , (req, res) => {
   res.render("pagini" + req.url, (err, rezRandare) => {
      if (err && err.message.includes("Failed to lookup view")) {
         renderError(res, 404, "Pagina nu a fost gasita!")
      } else {
         res.send(rezRandare)
      }
   })
})

app.get("/*.ejs", (req, res) => renderError(res, 403));

obGlobal = {
   erori: null
}

function createErrors() {
   let continutFisier = fs.readFileSync(__dirname + '/public/resurse/json/erori.json').toString("utf8")
   obGlobal.erori = JSON.parse(continutFisier)
}

createErrors()

function renderError(res, identificator, titlu, text, imagine) {
   let eroare = obGlobal.erori.info_erori.find(elem => elem.identificator == identificator)
   titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
   text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
   imagine = imagine || (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine;
   if (eroare && eroare.status) {
      res.status(identificator).render("pagini/eroare", {
         titlu:titlu,
         text:text,
         imagine:imagine
      })
   } else {
      res.render("pagini/eroare", {
         titlu:titlu,
         text:text,
         imagine:imagine
      })
   }
}