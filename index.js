const { render } = require('ejs');
const express = require('express')
const fs = require('fs')
const nodemailer = require('nodemailer')
const sharp=require("sharp");
require('dotenv').config()

const app = express()
const port = 8080

app.listen(port, console.log(`server started on port ${port}`))

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/'))

console.log(__dirname + '/public/')

app.get(["/", "/index", "/home"], (req, res) => {
   res.render("pagini/index", {
      ip: getIp(req),
      ceva: 10,
      altceva: 2,
      imagini: obGlobal.imagini
   })

   //console.log("Imagini = " + obGlobal.imagini)
})

app.get(["/inregistrare"], (req, res) => {
   res.render("pagini/inregistrare", {
      ip: getIp(req),
      ceva: 10,
      altceva: 2
   })
})

app.get("/regiune-europa", (req, res) => {
   const eroare = obGlobal.erori.info_erori.find(elem => elem.identificator == 404)
   const imagine = (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine
   repositories.places.findPlacesWithRegion(db)
   .then(places => {
      placesFiltered = places.filter(place => place.region.region_name == 'REGIUNE-EUROPA')
      if (placesFiltered.lenght == 0) {
         res.render("pagini/fara-produse", {
            noProducts: {
               titlu: "Ops! Nu s-au gasit locatii!",
               text: "Din pacate, nu s-au putut gasi locatii pe baza filtrelor..",
               imagine: imagine
            }
         })
      } else {
         res.render("pagini/regiune-america", {
            locatiiRegiuneAmerica: placesFiltered
         })
      }
   })
   .catch(err => {
      eroare = "Eroare la baza de date pentru getPlacesWithRegion" + err
      renderError(res, 500, eroare)
   })
})

app.get("/regiune-america", (req, res) => {
   const eroare = obGlobal.erori.info_erori.find(elem => elem.identificator == 404)
   const imagine = (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine
   repositories.places.findPlacesWithRegion(db)
   .then(places => {
      placesFiltered = places.filter(place => place.region.region_name == 'REGIUNE-AMERICA')
      if (placesFiltered.lenght == 0) {
         res.render("pagini/fara-produse", {
            noProducts: {
               titlu: "Ops! Nu s-au gasit locatii!",
               text: "Din pacate, nu s-au putut gasi locatii pe baza filtrelor..",
               imagine: imagine
            }
         })
      } else {
         res.render("pagini/regiune-america", {
            locatiiRegiuneAmerica: placesFiltered
         })
      }
   })
   .catch(err => {
      eroare = "Eroare la baza de date pentru getPlacesWithRegion" + err
      renderError(res, 500, eroare)
   })
})

app.get("/regiune-asia", (req, res) => {
   const eroare = obGlobal.erori.info_erori.find(elem => elem.identificator == 404)
   const imagine = (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine
   repositories.places.findPlacesWithRegion(db)
   .then(places => {
      placesFiltered = places.filter(place => place.region.region_name == 'REGIUNE-ASIA')
      if (placesFiltered.length == 0) {
         res.render("pagini/fara-produse", {
            noProducts: {
               titlu: "Ops! Nu s-au gasit locatii!",
               text: "Din pacate, nu s-au putut gasi locatii pe baza filtrelor..",
               imagine: imagine
            }
         })
      } else {
         res.render("pagini/regiune-asia", {
            locatiiRegiuneAsia: placesFiltered
         })
      }
   })
   .catch(err => {
      eroare = "Eroare la baza de date pentru getPlacesWithRegion" + err
      renderError(res, 500, eroare)
   })
})

app.get("/*.ejs", (req, res) => renderError(res, 403))

app.get("/*" , (req, res) => {
   console.log('url : ' + req.url)

   res.render("pagini/eroare" + req.url, (err, rezRandare) => {
      if (err && err.message.includes("Failed to lookup view")) {
         renderError(res, 404, "Pagina nu a fost gasita!")
      } else {
         res.send(rezRandare)
      }
   })
})

function getIp(req){//pentru Heroku/Render
   var ip = req.headers["x-forwarded-for"];//ip-ul userului pentru care este forwardat mesajul
   if (ip) {
       let vect = ip.split(",")
       return vect[vect.length - 1]
   } else if (req.ip) {
       return req.ip
   } else{
    return req.connection.remoteAddress
   }
}

obGlobal = {
   erori: null,
   imagini: null
}

function createErrors() {
   let continutFisier = fs.readFileSync(__dirname + '/public/resurse/json/erori.json').toString("utf8")
   obGlobal.erori = JSON.parse(continutFisier)
}

createErrors()

function renderError(res, identificator, titlu, text, imagine) {
   let eroare = obGlobal.erori.info_erori.find(elem => elem.identificator == identificator)
   titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu
   text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text
   imagine = imagine || (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine
   if (eroare && eroare.status) {
      res.status(identificator).render("pagini/eroare", {
         titlu: titlu,
         text: text,
         imagine: imagine
      })
   } else {
      res.render("pagini/eroare", {
         titlu: titlu,
         text: text,
         imagine: imagine
      })
   }
}

function createImages() {
   const continutFisier = fs.readFileSync(__dirname + '/public/resurse/json/galerie.json').toString("utf8")
   //console.log(continutFisier);
   const obiect = JSON.parse(continutFisier)
   const dim_mediu = { width: 400, height: 500 }

   obGlobal.imagini = obiect.imagini

   obGlobal.imagini.forEach((elem) => {
       [numeFisier, extensie] = elem.fisier.split(".")   //"briose-frisca.png" ->["briose-frisca", "png"]
       //console.log("cale fisier: " + obiect.cale_galerie)

       if (!fs.existsSync("public/" + obiect.cale_galerie + "/mediu/")) {
           fs.mkdirSync(obiect.cale_galerie + "/mediu/")
       }

       elem.fisier_mediu = obiect.cale_galerie + "/mediu/" + numeFisier + ".webp"
       elem.fisier = obiect.cale_galerie + "/" + elem.fisier

       sharp(__dirname + "/public/" + elem.fisier).resize(dim_mediu).toFile(__dirname + "/public/" + elem.fisier_mediu)
   })


   //console.log(obGlobal.imagini)
}

createImages()


console.log("Starting connection to database...")

const db = require("./app/models")

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.")
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message)
})

/*console.log(db.user.findAll())

const jane = db.user.build({
   user_id: 2,
   username: "username2",
   firstname: "Jane",
   lastname: "Doe",
   email: "email@email.com",
   password: "password",
   birth_date: 971201,
   role_id: 0
})*/

const repositories = require("./app/repositories")

/*repositories.users.saveUser(jane)
.then((message) => console.log("Utilizatorul a fost salvat cu succes!"))
.catch((error) => console.log("Nu s-a putut salva utilizatorul!"))


repositories.users.findMaxId(db)
.then((response) => console.log("Response: " + response))
.catch((error) => console.log("Error!"))*/


const formidable = require('formidable')
const e = require('express')
const { cosmosDb } = require('./config/db.config')

app.post("/inregistrare", (req, res) => {
   var formular = new formidable.IncomingForm()
   var username
   formular.parse(req, function(err, campuriText, campuriFile) {
       console.log(campuriText)
       console.log("Email: ", campuriText.email)
       //verificari - TO DO 
       var eroare = ""
       if (!campuriText.username) {
           eroare += "Username-ul nu poate fi necompletat."
       }
       //TO DO - de completat pentru restul de campuri required

       if (!campuriText.username.match("^[A-Za-z0-9]+$")) {
           eroare += "Username-ul trebuie sa contina doar litere mici/mari si cifre."
       }
       //TO DO - de completat pentru restul de campuri functia match

       if (eroare != "") {
           res.render("pagini/inregistrare", { err: eroare })
           return
       }
       
       repositories.users.findMaxId(db)
         .then((maxId) => {
            if (!maxId) {
               maxId = 0
            }

            const buildUser = db.user.build({
               user_id: maxId + 1,
               username: campuriText.username,
               firstname: campuriText.nume,
               lastname: campuriText.prenume,
               email: campuriText.email,
               password: campuriText.parola,
               chat_color: campuriText.culoareText,
               birth_date: 220201,
               role_id: 1
            }) // role_id default is 1 and is read

            console.log("User built: " + JSON.stringify(buildUser))
      
            const queryVerifUtiliz = repositories.users.findUserByUsername(db, username)
            .then((databaseUser) => {
               console.log("Username found:", JSON.stringify(databaseUser))
               if (databaseUser.length == 0) {
                  repositories.users.saveUser(buildUser)
                  .then((message) => {
                     var token = genereazaToken(100)
                     trimiteMail(campuriText.username, campuriText.email, token)
                     eroare += "Utilizatorul a fost inregistrat cu succes! Te rugam sa verifici email-ul pentru confirmare!"
                     res.render("pagini/inregistrare", { err: "", raspuns: eroare })
                  })
                  .catch((error) => {
                     eroare += "A aparut o eroare la baza de date!"
                  })
                  res.render("pagini/inregistrare", { err: eroare })
               } else {
                  eroare += "Username-ul mai exista."
                  res.render("pagini/inregistrare", { err: eroare })
               }
             })
             .catch((error) => {
               eroare += "A aparut o eroare!"
               res.render("pagini/inregistrare", { err: eroare })
            })
         })
         .catch((error) => {
            eroare += "A aparut o eroare la baza de date!"
            res.render("pagini/inregistrare",{ err: eroare })
         })
   })

   formular.on("field", (nume, val) => {  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
      console.log("----> ", nume, val)
      if (nume == "username") {
         username = val
      }
   })
})

async function trimiteMail(username, email, token) {
   var transp = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {//date login
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASSWORD
      },
      tls: {
         rejectUnauthorized: false
      }
   })

   const numeDomeniu = 'https://nicugnm-tehniciweb-app-service-1.azurewebsites.net'
   //genereaza html
   await transp.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Te-ai inregistrat cu succes",
      text: "Username-ul tau este " + username,
      html: `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
   })

   console.log("trimis mail")
}

sirAlphaNum = ""
v_intervale = [[48,57], [65,90], [97,122]]
for (let interval of v_intervale) {
   for (let i = interval[0]; i <= interval[1]; i++) {
      sirAlphaNum += String.fromCharCode(i)
   }
}

function genereazaToken(lungime) {
    sirAleator = ""

    for (let i = 0; i < lungime; i++) {
      sirAleator += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)]
    }

    return sirAleator
}

/*repositories.invoices.saveInvoice('Id1', 'Name1', {
   prop1: "prop1"
})
.then(item => console.log('Item ' + JSON.stringify(item) + ' has been saved!'))
.catch(err => console.log(err))*/