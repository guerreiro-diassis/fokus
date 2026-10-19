const toggle = document.querySelector('#toggle-music')

const audio = new Audio('/sounds/lofi.mp3')
audio.loop = true

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        audio.play()
    } else {
        audio.pause()
    }
})