const { timeStamp } = require('console')
const express = require('express')
const fs = require('fs')
const { waitForDebugger } = require('inspector')

const app = express()
const port = 8080

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

app.get(["/inregistrare"], (req, res) => {
   res.render("pagini/inregistrare", {
      ip: req.ip,
      ceva: 10,
      altceva: 2
   })
})

app.get("/*" , (req, res) => {
   res.render("pagini/eroare" + req.url, (err, rezRandare) => {
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

console.log("Starting connection to database...");

const db = require("./app/models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

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
});*/

const repositories = require("./app/repositories");

/*repositories.users.saveUser(jane)
.then((message) => console.log("Utilizatorul a fost salvat cu succes!"))
.catch((error) => console.log("Nu s-a putut salva utilizatorul!"))

repositories.users.findMaxId(db)
.then((response) => console.log("Response: " + response))
.catch((error) => console.log("Error!"))*/


const formidable = require('formidable')
const e = require('express')

app.post("/inregistrare", (req, res) => {
   var formular = new formidable.IncomingForm()
   var username
   formular.parse(req, function(err, campuriText, campuriFile) {
       console.log(campuriText)
       console.log("Email: ", campuriText.email)
       //verificari - TO DO 
       var eroare = "";
       if (!campuriText.username) {
           eroare+="Username-ul nu poate fi necompletat. ";
       }
       //TO DO - de completat pentru restul de campuri required

       if (!campuriText.username.match("^[A-Za-z0-9]+$")) {
           eroare += "Username-ul trebuie sa contina doar litere mici/mari si cifre. ";
       }
       //TO DO - de completat pentru restul de campuri functia match

       if (eroare != "") {
           res.render("pagini/inregistrare", { err: eroare });
           return;
       }
       
       repositories.users.findMaxId(db)
         .then((maxId) => {
            const buildUser = db.user.build({
               user_id: maxId + 1,
               username: campuriText.username,
               firstname: campuriText.nume,
               lastname: campuriText.prenume,
               email: campuriText.email,
               password: campuriText.parola,
               chat_color: campuriText.culoareText,
               birth_date: 220201,
               role_id: 0
            })
      
             const queryVerifUtiliz = repositories.users.findUserByUsername(db, username)
             .then((databaseUser) => {
               console.log("Username found:", JSON.stringify(databaseUser))
               if (databaseUser.length == 0) {
                  repositories.users.saveUser(buildUser)
                  .then((message) => {
                     eroare+="Utilizatorul a fost inregistrat cu succes!";
                  })
                  .catch((error) => {
                     eroare+="A aparut o eroare la baza de date!";
                  })
                  res.render("pagini/inregistrare",{err:eroare});
               } else {
                  eroare += "Username-ul mai exista.";
                  res.render("pagini/inregistrare",{err:eroare});
               }
             })
             .catch((error) => {
               eroare += "A aparut o eroare!"
               res.render("pagini/inregistrare",{err:eroare})
            })
         })
         .catch((error) => {
            eroare+="A aparut o eroare la baza de date!";
            res.render("pagini/inregistrare",{err:eroare})
         })

       /*client.query(queryVerifUtiliz, function(err, rez){
           if (err){
               console.log(err);
               res.render("pagini/inregistrare",{err:"Eroare baza date"});
           }

           else{
               if (rez.rows.length==0){

                   var criptareParola=crypto.scryptSync(campuriText.parola,parolaCriptare,32).toString('hex');
                   var token=genereazaToken(100);
                   var queryUtiliz=`insert into users (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}','${campuriText.prenume}', $1 ,'${campuriText.email}','${campuriText.culoareText}','${token}')`;

                   console.log(queryUtiliz, criptareParola);
                   client.query(queryUtiliz, [criptareParola], function(err, rez){ //TO DO parametrizati restul de query
                       if (err){
                           console.log(err);
                           res.render("pagini/inregistrare",{err:"Eroare baza date"});
                       }
                       else{
                           trimiteMail(campuriText.username,campuriText.email, token);
                           res.render("pagini/inregistrare",{err:"", raspuns:"Date introduse"});
                       }
                   });
               }
               else{
                   eroare+="Username-ul mai exista. ";
                   res.render("pagini/inregistrare",{err:eroare});
               }
           }
       });*/
   });

   formular.on("field", (nume, val) => {  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
       console.log("----> ", nume, val);
       if (nume=="username")
           username=val;
   })
});