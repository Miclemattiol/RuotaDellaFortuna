

var giocatore_attivo;
var frase_attiva;
var valore_ruota = 0;
var giocatori = [];
var vocali = ['A', 'E', 'I', 'O', 'U'];
var prezzoLettera = 5;

setPlayers();
var punteggi = [0, 0, 0];
var frasi = ["Sono una frase"];
/* Quanti gradi ha ogni spicchio della ruota?
 * 360 gradi diviso il numero di caselle della ruota, ad esempio 12 spicchi avranno 30 gradi
 */
var gradi_per_spicchio = 30;
var numero_spicchi = 12;
var valori_ruota = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var bottone_inizia = document.getElementById("inizia_gioco");
var bottone_gira = document.getElementById("gira");
var bottone_soluzione = document.getElementById("soluzione");
var bottone_scegli_lettera = document.getElementById("cerca_lettera");
var bottone_acquista_lettera = document.getElementById("acquistaLettera");
var input_lettera = document.getElementById("lettera");
var input_soluzione = document.getElementById("input_soluzione");

function sleep(ms) {  //Serve per impostare un tempo di ritardo
  return new Promise(resolve => setTimeout(resolve, ms));
}

function acquistaLettera() {
  var punteggio = document.getElementById("punteggio" + giocatore_attivo);
  if (parseInt(punteggio.value) >= prezzoLettera) {
    punteggio.value = parseInt(punteggio.value) - prezzoLettera;
  }
  var celle = document.getElementsByClassName("cella ");
  var tmp;
  for (var i = 0; i < frase_attiva.length && tmp == null; i++) {
    if (celle[i].innerText == "") {
      tmp = i;
    }
  }
  if (tmp < frase_attiva.length) {
    var lettera = frase_attiva[tmp];
    //var moltiplicatore = 0;
    //var trovata_lettera = false;
    for (var i = 0; i < frase_attiva.length; i++) {
      if (frase_attiva[i] == lettera && celle[i].innerText == "") {
        //moltiplicatore = moltiplicatore + 1;
        celle[i].innerText = lettera;
      }
    }
  }
}

function getRandomInt(min, max) {
  /* //Il max è escluso e il min è incluso
   */
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * La funzione serve a richiedere tramite un prompt quanti giocatori ci sono e successivamente impostarli all'interno del vettore dei giocatori
 */
function setPlayers() {
  var nGiocatori;
  do { //Chiedo il numero di giocatori finchè questo non è un numero intero maggiore o uguale a 2
    nGiocatori = prompt("Inserisci il numero di giocatori:", 2);
  } while (isNaN(nGiocatori) || nGiocatori < 2);
  nGiocatori = parseInt(nGiocatori);
  //var punteggi = document.getElementById("punteggio");
  var tmpPlayers = document.getElementById("giocatori");
  for (let i = 0; i < nGiocatori; i++) {  //Chiedo i nomi ai giocatori e creo una casella per i suoi punteggi
    giocatori[i] = prompt("Giocatore " + i + " inserisci il tuo nome: ", "Giocatore " + i);
    tmpPlayers.innerHTML +=
      "<li>" +
      "<input type=\"text\" id=\"punteggio" + i + "\" size=4 class=\"punteggio\" readonly value=\"0\"/>" + "<span id=\"giocatore" + i + "\">" + giocatori[i] + "</span>" +
      "</li>\t";
    //punteggi.innerHTML+="<input type=\"text\" id=\"punteggio" + i + "\" size=4 class=\"punteggio\" readonly />";
  }
}

function inizia_gioco() {
  seleziona_frase();
  crea_tabellone();
  giocatore_attivo = 0;
  //document.getElementById("giocatore_attivo").innerText = giocatori[giocatore_attivo];
  document.getElementById("giocatore" + giocatore_attivo).style.fontWeight = "bold";
  bottone_gira.disabled = false;
  bottone_inizia.disabled = true;
}

function seleziona_frase() {
  var indice_frase_attiva = getRandomInt(0, frasi.length);
  frase_attiva = frasi[indice_frase_attiva].toUpperCase();
}

function crea_tabellone() {
  var tabellone = document.getElementById("tabellone");
  var html = "";
  for (var i = 0; i < frase_attiva.length; i++) {
    html = html + '<span class="cella" id="id' + i + '"></span>';
  }
  tabellone.innerHTML = html;
  var celle = document.getElementsByClassName("cella");
  for (var i = 0; i < celle.length; i++) {
    if (frase_attiva[i] != " ") {
      //console.log(vocali.indexOf(frase_attiva[i]));
      if (vocali.indexOf(frase_attiva[i].toUpperCase()) != -1) {
        celle[i].className = celle[i].className + " consonante";
      } else {
        celle[i].className = celle[i].className + " vocale";
      }
    }
  }
}

function gira() {
  reset_ruota();
  var posizione_ruota = getRandomInt(0, numero_spicchi);
  console.log(posizione_ruota);
  var gradi =
    posizione_ruota * gradi_per_spicchio + 3600 + gradi_per_spicchio / 2;
  var circle = document.getElementById("circle");
  //circle.classList.add("start");
  circle.style.transitionProperty = "transform";
  circle.style.transitionDuration = "3s";
  circle.style.transform = "translateX(-50%) rotate(-" + gradi + "deg)";
  sleep(3000).then(() => {
    valore_ruota = valori_ruota[posizione_ruota];
    document.getElementById("valore_ruota").innerText = valore_ruota;
    bottone_scegli_lettera.disabled = false;
    bottone_acquista_lettera.disabled = false;
    input_lettera.disabled = false;
  });
  bottone_gira.disabled = true;
  document.getElementById("audio").play();
}

function reset_ruota() {
  circle.style.transitionProperty = "none";
  circle.style.transitionDuration = "0s";
  circle.offsetHeight;
  circle.style.transform = "translateX(-50%) rotate(0deg)";
}

function prossimo_giocatore() {
  document.getElementById("giocatore" + giocatore_attivo).style.fontWeight = "normal";
  giocatore_attivo = (giocatore_attivo + 1) % giocatori.length;
  //document.getElementById("giocatore_attivo").innerText = giocatori[giocatore_attivo];
  document.getElementById("giocatore" + giocatore_attivo).style.fontWeight = "bold";
  reset_ruota();
  bottone_gira.disabled = false;
  bottone_scegli_lettera.disabled = true;
  bottone_acquista_lettera.disabled = true;
  input_lettera.disabled = true;
}

function prossima_lettera() {
  bottone_gira.disabled = false;
  bottone_scegli_lettera.disabled = true;
  bottone_acquista_lettera.disabled = true;
  bottone_soluzione.disabled = false;
  input_lettera.disabled = true;
  input_soluzione.disabled = false;
  reset_ruota();
}

function cambia_frase() {
  seleziona_frase();
  crea_tabellone();
}

function cerca_lettera() {
  var lettera = document.getElementById("lettera").value.toUpperCase();
  if (lettera != "") {
    var moltiplicatore = 0;
    //var trovata_lettera = false;
    var celle = document.getElementsByClassName("cella ");
    for (var i = 0; i < frase_attiva.length; i++) {
      if (frase_attiva[i] == lettera && celle[i].innerText == "") {
        moltiplicatore = moltiplicatore + 1;
        celle[i].innerText = lettera;
      }
    }
    aggiorna_punteggio(valore_ruota * moltiplicatore);
    if (moltiplicatore == 0) {
      prossimo_giocatore();
    } else {
      prossima_lettera();
    }
    document.getElementById("lettera").value = "";
  }
}

function aggiorna_punteggio(x) {
  var punteggio = document.getElementById("punteggio" + giocatore_attivo);
  punteggio.value = parseInt(punteggio.value) + x;
}

function soluzione() {
  var soluzione = document.getElementById("input_soluzione").value;
  if (frase_attiva.trim().toUpperCase() == soluzione.toUpperCase()) {
    var punteggio = document.getElementById("punteggio" + giocatore_attivo)
      .value;
    alert(
      "Il giocatore " +
      giocatori[giocatore_attivo] +
      " ha indovinato la frase. Ha vinto: " +
      punteggio + "" +
      "€."
    );
    bottone_gira.disabled = true;
    bottone_inizia.disabled = false;
  } else {
    alert(
      "Il giocatore " +
      giocatori[giocatore_attivo] +
      " NON indovinato la frase, Prossimo giocatore!!"
    );
    prossimo_giocatore();
  }
}

/* Associo le funzioni ai bottoni
 */
document.getElementById("valore_ruota").innerText = valore_ruota;
document.getElementById("inizia_gioco").onclick = inizia_gioco;
document.getElementById("gira").onclick = gira;
document.getElementById("prossimo_giocatore").onclick = prossimo_giocatore;
document.getElementById("cambia_frase").onclick = cambia_frase;
document.getElementById("cerca_lettera").onclick = cerca_lettera;
document.getElementById("soluzione").onclick = soluzione;
