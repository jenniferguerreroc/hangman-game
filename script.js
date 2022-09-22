var wordss = [
    "CARRETERA",
    "ESENCIAL",
    "LENGUAJE",
    "ZAPATILLA",
    "MICROONDAS",
    "PARACAIDAS",
    "CEMENTO",
    "LAMPARA",
    "LABERINTO",
    "UNIVERSO"
]

var game = null
var end = false

var $html = {
    hangman: document.getElementById('hangman'),
    word: document.querySelector('.word'),
    wrongletters: document.querySelector('.wrongletters'),
}

//function to change image/status
function hangmangame(game) {
    //change of images
    var $elem
    $elem = $html.hangman
    
    var status = game.status
    if (status == 8){
        status = game.laststatus
    }

    $elem.src = './img/hang0' + status + '.svg'

    //correct letters
    var newword = game.newword
    var correctletter = game.correctletter
    $elem = $html.word
    $elem.innerHTML = ''
    
    for (let letter of newword){
        let $span = document.createElement('span')
        let $txt = document.createTextNode('')

        if (correctletter.indexOf(letter) >= 0 ) {
            $txt.nodeValue = letter
        }
        $span.setAttribute('class', 'guessed' )
        $span.appendChild($txt)
        $elem.appendChild($span)
    }

    var incorrectletter = game.incorrectletter
    $elem = $html.wrongletters
    $elem.innerHTML = ''

    for (let letter of incorrectletter){
        let $span = document.createElement('span')
        let $txt = document.createTextNode(letter)
        $span.setAttribute('class', 'notguessed')
        $span.appendChild($txt)
        $elem.appendChild($span)
    } 
}

// function to guess the letters
function guess (game, letter) {
    var status = game.status

    //if you win/lose
    if (status == 1 || status == 8){
        return
    }

    var correctletter = game.correctletter
    var incorrectletter = game.incorrectletter

    //guess correct or incorrect letter
    if (correctletter.indexOf(letter) >= 0 || incorrectletter.indexOf(letter) >= 0) {
        return
    }

    //if the letter is correct
    var newword = game.newword
    if (newword.indexOf(letter) >= 0){
        let win = true
        for(let l of newword) {
            if (correctletter.indexOf(l) < 0 && l != letter) {
                win = false
                game.laststatus = game.status
                break
            }
        }

        // win status change
        if (win) {
            game.status = 8
        }

        //ad letter to the list of correct letters
        correctletter.push(letter)

    } else {
        //if the letter is incorrect,change the status
        game.status--

        //ad letter to the list of incorrect letters
        incorrectletter.push(letter)
    }
}

//bring elements to appear or disappear
document.getElementById("appear").style.display="none";

const body = document.querySelector('body');
let disappear = document.getElementById('disappear');
let appear = document.getElementById('appear');

//button start
document.getElementById('btn-start').onclick = function gamestarted(){
    body.style.background=""
    body.style.backgroundColor= "rgba(0,0,0,0.8)" //opacity 
    disappear.style.display = "none"; //button "start game" disappears
    appear.style.display="flex"; //appear game
    newgame()

    window.onkeypress = function guesstheletter(e) {
        var letter = e.key
        letter = letter.toUpperCase()
        if (/[^A-ZÑ]/.test(letter)) {
            return
        }

        guess(game,letter)
        var status = game.status

        if (status == 8 && !end){
    
            setTimeout(function() { 
                Swal.fire({
                    title: '¡Has ganado!',
                    background: '#000',
                    backdrop: true,
                    grow: 'fullscreen',
                    customClass: {
                        title: 'titlesweet',
                        confirmButton: 'buttonsweet',
                        popup: 'popup',
                    },
                }); 
            }, 500);
            end = true
        } else if (status == 1 && !end){
            let newword = game.newword
            setTimeout(function() { 
                Swal.fire({
                    title: '¡Has perdido!',
                    text: 'La palabra era: ' + newword,
                    background: '#000',
                    backdrop: true,
                    grow: 'fullscreen',
                    customClass: {
                        title: 'titlesweet',
                        confirmButton: 'buttonsweet',
                        popup: 'popup',
                    },
                }); 
            }, 500);
            end = true
        }
        
        hangmangame(game);
        

    }
}  

//play new game
window.newgame = function newgame() {
    var newword = randomword()
    game = {}
    game.newword = newword
    game.status = 7
    game.correctletter = []
    game.incorrectletter = []
    end = false
    hangmangame(game)
}

//chose random word from the string
function randomword(){
    var index = ~~(Math.random() * wordss.length)
    return wordss[index]
}

newgame()
console.log(game)

//button add new word 
function add (){
    let inputword = document.getElementById("input-newword").value
    inputword = inputword.toUpperCase()
    wordss.push(inputword);
    Swal.fire({
        title: 'Palabra agregada',
        background: '#000000',
        toast: true,
        position: 'top',
        timer: 2000,
        timeProgressBar: true,
        showConfirmButton: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
         customClass: {
            popup: 'addpop',
        }, 
    });
    erasetext();
    return false;
}

//clear textarea
function erasetext(){
    document.getElementById('input-newword').value = "";
}

//button give up
document.getElementById('btn-giveup').onclick = function () {
    appear.style.display="none";
    disappear.style.display = "flex";
    body.style.background = "";
    end = true
}

//button new game
document.getElementById('btn-newgame').onclick = function(){
    newgame()
}
//set volume
var audio = document.getElementById("audio");
audio.volume = 0.1;