window.addEventListener("load",  () => {

    document.getElementById("inp-pret").onchange = function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }

    document.getElementById("filtrare").onclick = () => {
        //verificare inputuri
        condValidare = true
        const inpNume = document.getElementById("inp-nume").value.toLowerCase().trim()
        condValidare = condValidare && inpNume.match(new RegExp("^[a-zA-Z]*$"))

        if (!condValidare) {
            alert("Inputuri gresite")
            return
        }

        const locatii = document.getElementsByClassName("locatie")
        
        for (let locatie of locatii) {
            let cond1 = false, cond2 = false
            locatie.style.display = "none"

            let nume = locatie.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim()

            if (nume.includes(inpNume)) {
                cond1 = true;
            }

            if (cond1) {
                locatie.style.display = "block"
            }
        }
    }

    document.getElementById("resetare").onclick = () => {
        let locatii = document.getElementsByClassName("locatie")

        for (let locatie of locatii) {
            locatie.style.display = "block"
        }

        //resetare filtre
        document.getElementById("inp-nume").value = ""
    }

    sorteaza = (semn) => {
        let locatii = document.getElementsByClassName("locatie");
        let v_locatie = Array.from(locatii);


        v_locatie.sort((a, b) => {
            var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML)
            var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML)

            if (pret_a == pret_b) {
                var rating_a = parseFloat(a.getElementsByClassName("val-rating")[0].innerHTML)
                var rating_b = parseFloat(b.getElementsByClassName("val-rating")[0].innerHTML)
                
                if (rating_a == rating_b) {
                    var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML
                    var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML

                    return semn * nume_a.localeCompare(nume_b)
                }

                return (rating_a - rating_b) * semn
            }

            return (pret_a-pret_b) * semn
        })

        for (let locatie of v_locatie) {
            locatie.parentNode.appendChild(locatie);
        }
    }

    document.getElementById("sortCrescNume").onclick = () => {
        sorteaza(1)
    }

    document.getElementById("sortDescNume").onclick = () => {
        sorteaza(-1)
    }
})