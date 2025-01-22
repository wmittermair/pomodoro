let timeLeft;
let timerId = null;
let isRunning = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('shortBreak');
const longBreakButton = document.getElementById('longBreak');

const POMODORO_TIME = 25 * 60;    // 25 Minuten = 1500 Sekunden
const SHORT_BREAK_TIME = 5 * 60;   // 5 Minuten = 300 Sekunden
const LONG_BREAK_TIME = 15 * 60;   // 15 Minuten = 900 Sekunden

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Titel aktualisieren
    let mode = '';
    if (pomodoroButton.classList.contains('active')) {
        mode = 'Pomodoro';
    } else if (shortBreakButton.classList.contains('active')) {
        mode = 'Kurze Pause';
    } else {
        mode = 'Lange Pause';
    }
    
    document.title = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} - ${mode}`;
}

function playAlarm() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Weckerton-Einstellungen
    oscillator.type = 'square'; // Schärferer Klang als 'sine'
    gainNode.gain.value = 0.05;  // Lautstärke auf 5%
    
    // Weckerton-Muster: Frequenz zwischen 750 und 500 Hz wechseln
    let isHigh = true;
    const beepInterval = setInterval(() => {
        oscillator.frequency.value = isHigh ? 750 : 500;
        isHigh = !isHigh;
    }, 200); // Alle 200ms wechseln
    
    oscillator.start();
    
    // Alarm nach 2 Sekunden stoppen
    setTimeout(() => {
        clearInterval(beepInterval);
        oscillator.stop();
        audioContext.close();
    }, 2000);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.innerHTML = '<i class="material-icons">pause</i><span>Pause</span>';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                isRunning = false;
                startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
                playAlarm();
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        isRunning = false;
        startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
    }
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
    timeLeft = POMODORO_TIME;
    updateDisplay();
}

function setActiveButton(button) {
    [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

startButton.addEventListener('click', () => {
    if (!isRunning) {
        // Timer starten
        isRunning = true;
        startButton.innerHTML = '<i class="material-icons">pause</i><span>Pause</span>';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                isRunning = false;
                startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
                playAlarm();
            }
        }, 1000);
    } else {
        // Timer pausieren
        isRunning = false;
        startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
        clearInterval(timerId);
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timerId);
    isRunning = false;
    startButton.innerHTML = '<i class="material-icons">play_circle</i><span>Start</span>';
    
    // Zurück zur aktuell ausgewählten Zeit
    if (pomodoroButton.classList.contains('active')) {
        timeLeft = POMODORO_TIME;
    } else if (shortBreakButton.classList.contains('active')) {
        timeLeft = SHORT_BREAK_TIME;
    } else {
        timeLeft = LONG_BREAK_TIME;
    }
    updateDisplay();
});

pomodoroButton.addEventListener('click', () => {
    timeLeft = POMODORO_TIME;
    updateDisplay();
    pomodoroButton.classList.add('active');
    shortBreakButton.classList.remove('active');
    longBreakButton.classList.remove('active');
});

shortBreakButton.addEventListener('click', () => {
    timeLeft = SHORT_BREAK_TIME;
    updateDisplay();
    pomodoroButton.classList.remove('active');
    shortBreakButton.classList.add('active');
    longBreakButton.classList.remove('active');
});

longBreakButton.addEventListener('click', () => {
    timeLeft = LONG_BREAK_TIME;
    updateDisplay();
    pomodoroButton.classList.remove('active');
    shortBreakButton.classList.remove('active');
    longBreakButton.classList.add('active');
});

// Initialize
timeLeft = POMODORO_TIME;
updateDisplay(); 