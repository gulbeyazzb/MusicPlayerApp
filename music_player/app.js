const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const playBtn = document.querySelector("#controls #btn-play")
const nextBtn = document.querySelector("#controls #btn-next")
const prevBtn = document.querySelector("#controls #btn-prev")
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar")
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");



const player = new MusicPlayer(musicList);



window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlayingNow();
});

const displayMusic = (music) => {
    title.innerText = music.getName();  //müzik adını buradan düzelttim.
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

playBtn.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prevBtn.addEventListener("click", () => { prevMusic(); });

nextBtn.addEventListener("click", () => { nextMusic(); });

const playMusic = () => {
    container.classList.add("playing");
    play.classList = "fa-solid fa-pause";
    audio.play();
}

const pauseMusic = () => {
    container.classList.remove("playing");
    play.classList = "fa-solid fa-play";
    audio.pause();
}


const prevMusic = () => {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlayingNow();
}

const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const güncellenenSaniye = saniye < 10 ? `0${saniye}` : `${saniye}`;
    const sonuc = `${dakika}:${güncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let muteState = "muted";

volume.addEventListener("click", () => {
    if (muteState === "muted") {
        audio.muted = true;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-mute";
        volumeBar.value = 0;
    }
    else {
        audio.muted = false;
        volume.classList = "fa-solid fa-volume-high";
        muteState = "muted";
        volumeBar.value = 100;
    }
});

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    console.log(value);
    if (value == 0) {
        audio.muted = true;
        muteState = "unmuted";
        volume.classList = "fa-solid fa-volume-mute";
        volumeBar.value = 0;
    }
    else if (value < 50) {
        audio.muted = false;
        volume.classList = "fa-solid fa-volume-low";
        muteState = "muted";
    }
    else if (value > 50 & value <= 100) {
        volume.classList = "fa-solid fa-volume-high";
    }
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag = `
        <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
            <span>${list[i].getName()}</span>
            <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
            <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
    `;
        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () => {
            liAudioDuration.innerText = calculateTime(liAudioTag.duration);
        });

    }
}

const selectedMusic = (li) => {
    player.index = li.getAttribute("li-index");
    displayMusic(player.getMusic());
    playMusic();
    isPlayingNow();
}

const isPlayingNow = () => {
    for (let li of ul.querySelectorAll("li")) {
        if (li.classList.contains("playing")) {
            li.classList.remove("playing");
        }

        if (li.getAttribute("li-index") == player.index) {
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
})