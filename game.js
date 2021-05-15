const computer = document.getElementById('computer')
const friend = document.getElementById('friend')
const x = document.getElementById('x')
const o = document.getElementById('o')
const play = document.getElementById('start')
const startPage = document.getElementById('start-page')
const pulsante = document.querySelectorAll('.pulsanti')
const boardPage = document.getElementById('board-page')
const giocaAncora = document.getElementById('gioca-ancora')
const schermataPrincipale = document.getElementById('schermata-principale')
const player = new Object
let OPPONENT
let turno
let gameData = new Array(9)
boardPage.style.display = 'none'
var iter = 0
const playAgain = document.getElementById('gioca-ancora')
const notPlayAgain = document.getElementById('schermata-principale')
var pareggi = 0
var vinciteX = 0
var vinciteO = 0
var time = document.getElementById('time')
var winsX = document.getElementById('xwins')
var winsO = document.getElementById('owins')
var ties = document.getElementById('ties')
var accensione = 0
var minuto = 0
var secondo = 0

computer.addEventListener('click', function(){
    OPPONENT = computer
    colors(computer, friend)
})

friend.addEventListener('click', function(){
    OPPONENT = friend
    colors(friend, computer)
})

x.addEventListener('click', function(){
    player.man = 'X'
    player.computer = 'O'
    player.friend = 'O'
    colors(x,o)
})

o.addEventListener('click', function(){
    player.man = 'O'
    player.computer = 'X'
    player.friend = 'X'
    colors(o,x)
})

play.addEventListener('click', function(){
    startGame()
})

playAgain.addEventListener('click', function(){
    notReset()
    closeModal(modal)
})

notPlayAgain.addEventListener('click', function(){
    reset()
    closeModal(modal)
})

function colors(on, off) {
    on.style.backgroundColor = '#1cfc2b'
    off.style.backgroundColor = 'white'
}

function allOff(off, off1, off2, off3) {
    off.style.backgroundColor = 'white'
    off1.style.backgroundColor = 'white'
    off2.style.backgroundColor = 'white'
    off3.style.backgroundColor = 'white'
}

function startGame() {
    if ( !OPPONENT ) {
        computer.style.backgroundColor = 'tomato'
        friend.style.backgroundColor = 'tomato'
        return
    }

    if ( !player.man ) {
        x.style.backgroundColor = 'tomato'
        o.style.backgroundColor = 'tomato'
        return
    }

    turno = player.man
    startPage.classList.add('hide')
    boardPage.style.display = 'flex'
    allOff(computer, friend, x, o)
    if (OPPONENT == computer) {
        pulsante.forEach(button => {
            button.addEventListener('click', pcTurnoNuovo)
        })
    }
    if (OPPONENT == friend) {
        pulsante.forEach(button => {
            button.addEventListener('click', nuovoturno)
        })
    }
}

function statistiche() {
    time.textContent = secondo + ' s'
    winsX.textContent = vinciteX
    winsO.textContent = vinciteO
    ties.textContent = pareggi
}

statistiche()

function nuovoturno(e) {
    if (secondo == 0){
        avvioTimer()
    }
    const spazi = Array.from(pulsante)
    const index = spazi.indexOf(e.target)
    if (gameData[index]) return
    gameData[index] = turno

    if (turno === 'X') {
        pulsante[index].textContent = 'X'
        if(isWinner( gameData, turno )){
            vinciteX ++
            gameOver( 1 )
            return
        }
        if(isTie( gameData )) {
            pareggi ++
            gameOver( 0 )
        }
        turno = 'O'
        return
    }

    if (turno === 'O') {
        pulsante[index].textContent = 'O'
        if(isWinner( gameData, turno )){
            vinciteO ++
            gameOver( -1 )
            return
        }
        if(isTie( gameData )){
            pareggi ++
            gameOver( 0 )
        }
        turno = 'X'
        return
    }
}

const COMBOS = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
]

function isWinner( gameData, player ) {
    for (let i = 0; i < COMBOS.length; i++) {
        let won = true;
        for (let j = 0; j < COMBOS[i].length; j++) {
            let id = COMBOS[i][j]
            won = gameData[id] == player && won
        }

        if (won) {
            return true
        }
    }
    return false
}

function isTie( gameData ) {
    let boardFull = true

    for (let i = 0; i < gameData.length; i++) {
        boardFull = gameData[i] && boardFull
    }

    if (boardFull) {
        return true
    }

    return false
}

function gameOver( winner ) {
    statistiche()
    resetTime()
    let risultati = document.getElementById('risultati')
    if ( winner === 0 ) {
        risultati.textContent = "It's a tie!"
        openModal(modal)
        return
    } else {
        risultati.textContent = turno + ' won!'
        openModal(modal)
    }
}

function resetBottoni() {
    if (OPPONENT == computer) {
        pulsante.forEach(button => {
            button.removeEventListener('click', pcTurnoNuovo)
        })
    }
    
    if (OPPONENT == friend) {
        pulsante.forEach(button => {
            button.removeEventListener('click', nuovoturno)
        })
    }
}

function reset() {
    time.textContent = secondo + ' s'
    resetBottoni()
    risultati.textContent = ''
    startPage.classList.remove('hide')
    boardPage.style.display = 'none'
    OPPONENT = undefined
    player.man = undefined
    player.computer = undefined
    player.friend = undefined
    gameData = new Array(9)
    for(let i = 0; i < pulsante.length; i++) {
        pulsante[i].textContent = ''
    }
    pareggi = 0
    vinciteX = 0
    vinciteO = 0
    statistiche()
}

function notReset() {
    time.textContent = secondo + ' s'
    risultati.textContent = ''
    gameData = new Array(9)
    for(let i = 0; i < pulsante.length; i++) {
        pulsante[i].textContent = ''
    }
}

var index

function pcTurnoNuovo(spazio) {
    if (secondo == 0){
        avvioTimer()
    }
    if (OPPONENT == friend) return
    if (gameData[spazio.target.id]) return
    turno = player.man
    turni(spazio.target.id, player.man)
    if(!isWinner(gameData, player.man))
    turno = player.computer
    console.log(minimax(gameData, player.computer, -Infinity, +Infinity).evaluation)
    index = minimax(gameData, player.computer).id;
    if(!isTie(gameData))turni(index, player.computer)
}

function turni(squareId, player) {
    gameData[squareId] = player
    pulsante[squareId].textContent = player
    if(isWinner( gameData, player )){
        gameOver( 1 )
    }
    if(isTie( gameData )) {
        gameOver( 0 )
    }
}

function spaziVuoti(gameData){
    let EMPTY = [];

    for( let id = 0; id < gameData.length; id++){
        if(!gameData[id]) EMPTY.push(id);
    }

    return EMPTY;
}

function minimax(gameData, PLAYER) {
    if( isWinner(gameData, player.computer) ) return {evaluation : +10}
    if( isWinner(gameData, player.man)      ) return {evaluation : -10}
    if( isTie(gameData)                     ) return {evaluation : 0}
    iter++


    let EMPTY_SPACES = spaziVuoti(gameData)
    let moves = []
    
    for (let i = 0; i < EMPTY_SPACES.length; i++){
        let id = EMPTY_SPACES[i]
        
        let backup = gameData[id]

        gameData[id] = PLAYER

        let move = {}
        move.id = id
        
        if (PLAYER == player.computer){
            move.evaluation = minimax(gameData, player.man).evaluation
        } else {
            move.evaluation = minimax(gameData,player.computer).evaluation
        }
        gameData[id] = backup
        moves.push(move)
    }

    let bestMove

    if (PLAYER == player.computer){
        // MAX
        let bestEvaluation = -Infinity
        for ( let i = 0; i < moves.length; i++){
            if(moves[i].evaluation > bestEvaluation){
                bestEvaluation = moves[i].evaluation
                bestMove = moves[i]
            }
        }
    } else {
        // MINI
        let bestEvaluation = +Infinity
        for ( let i= 0; i< moves.length; i++){
            if(moves[i].evaluation < bestEvaluation){
                bestEvaluation = moves[i].evaluation
                bestMove = moves[i]
            }
        }
    }

    return bestMove
}

// timer

function avvioTimer() {
    somma()
}

function somma() {
    if (secondo == 0) {
        secondo = 1
    }
    update()
    t = setTimeout(somma, 1000)
}

function update() {
    if(secondo == 59) {
        time.textContent = minuto + ' m ' + secondo + ' s'
        minuto ++
        secondo = 0
    } else {
        if(minuto == 0) {
            time.textContent =  secondo + ' s'
            secondo ++
        } else {
            time.textContent = minuto + ' m ' + secondo + ' s'
            secondo ++
        }
    }
}

function resetTime() {
    minuto = 0
    secondo = 0
    clearTimeout(t)
}

// risultati

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
        notReset()
        closeModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        notReset()
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}