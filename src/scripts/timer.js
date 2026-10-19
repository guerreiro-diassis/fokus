const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

const finishAudio = new Audio('/sounds/ta-da.mp3')

const context = {
    '1': FOCUS_TIME,
    '2': SHORT_BREAK_TIME,
    '3': LONG_BREAK_TIME
}

const timerDisplay = document.querySelector('.timer-card__time')
const timerForm = document.querySelector('.timer-card__form')

const timerButtonIcon = document.querySelector('.timer-card__form .icon')
const timerButtonText = timerForm.querySelector('.button')

let currentMode = '1'
let remainingSeconds = FOCUS_TIME; 
let intervalId = null

function startTimer() {
    timerButtonText.lastChild.textContent = 'Pausar'
    timerButtonIcon.classList.replace('icon--play', 'icon--pause')

    intervalId = setInterval(() => {
        remainingSeconds--
        timerDisplay.textContent = formatTimer(remainingSeconds)
        if (remainingSeconds < 0) {
            pauseTimer()
            resetTimer(currentMode)
            finishAudio.play()
        }
    }, 1000)
}

function pauseTimer() {
    timerButtonText.lastChild.textContent = 'Começar'
    timerButtonIcon.classList.replace('icon--pause', 'icon--play')
    clearInterval(intervalId)
    intervalId = null
}

timerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (intervalId) {
        pauseTimer()
    } else {
        startTimer()
    }
})

function formatTimer(seconds) {
    const date = new Date(seconds * 1000);
    
    return date.toLocaleTimeString('pt-br', {
        minute: '2-digit',
        second: '2-digit', 
        timeZone: 'UTC'
    })
}

export function resetTimer(mode) {
    currentMode = mode;
    if (intervalId) {
        pauseTimer()
    }
    remainingSeconds = context[mode]
    timerDisplay.textContent = formatTimer(remainingSeconds)

}

resetTimer(1)
