document.addEventListener("DOMContentLoaded", function() {
    let timer;
    let startTime;
    let elapsedTime = 0;
    let lapTime = 0;
    let running = false;

    const display = document.getElementById('display');
    const laps = document.getElementById('laps');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    const lapButton = document.getElementById('lap');
    const exportButton = document.getElementById('export');
    const fullscreenButton = document.getElementById('fullscreen');

    startButton.addEventListener('click', start);
    stopButton.addEventListener('click', stop);
    resetButton.addEventListener('click', reset);
    lapButton.addEventListener('click', recordLap);
    exportButton.addEventListener('click', exportLaps);
    fullscreenButton.addEventListener('click', toggleFullScreen);

    function start() {
        console.log('Start button clicked');
        if (!running) {
            running = true;
            startTime = Date.now() - elapsedTime;
            timer = setInterval(updateDisplay, 10);
        }
    }

    function stop() {
        console.log('Stop button clicked');
        if (running) {
            running = false;
            clearInterval(timer);
            elapsedTime = Date.now() - startTime;
        }
    }

    function reset() {
        console.log('Reset button clicked');
        running = false;
        clearInterval(timer);
        elapsedTime = 0;
        lapTime = 0;
        updateDisplay(); // Reset the display to 00:00:00
        laps.innerHTML = '';
        localStorage.removeItem('laps');
    }

    function recordLap() {
        console.log('Lap button clicked');
        if (running) {
            const now = Date.now();
            const lapElapsedTime = now - (startTime + lapTime);
            lapTime += lapElapsedTime;
            const lapElement = document.createElement('li');
            lapElement.textContent = formatTime(lapElapsedTime);
            laps.appendChild(lapElement);
            saveLaps();
        }
    }

    function updateDisplay() {
        const now = running ? Date.now() : startTime;
        const diff = now - startTime;
        display.textContent = formatTime(diff);
    }

    function formatTime(time) {
        const date = new Date(time);
        const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
        const milliseconds = String(time % 1000).padStart(3, '0');
        return `${minutes}:${seconds}:${milliseconds}`;
    }

    function saveLaps() {
        const lapTimes = Array.from(laps.children).map(lap => lap.textContent);
        localStorage.setItem('laps', JSON.stringify(lapTimes));
    }

    function loadLaps() {
        const lapTimes = JSON.parse(localStorage.getItem('laps')) || [];
        lapTimes.forEach(time => {
            const lapElement = document.createElement('li');
            lapElement.textContent = time;
            laps.appendChild(lapElement);
        });
    }

    function exportLaps() {
        console.log('Export button clicked');
        const lapTimes = Array.from(laps.children).map(lap => lap.textContent);
        const blob = new Blob([lapTimes.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'laps.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    function toggleFullScreen() {
        console.log('Fullscreen button clicked');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    window.onload = loadLaps;
});
