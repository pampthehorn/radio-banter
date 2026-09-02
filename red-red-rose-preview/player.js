const tracks = [
  {
    title: "AI",
    version: "Master 1",
    src: "audio/ai.mp3",
    duration: "2:52"
  },
  {
    title: "Viva Palestine",
    version: "Master 1",
    src: "audio/viva-palestine.mp3",
    duration: "1:22"
  },
  {
    title: "Red Red Rose",
    version: "Mostly mono mix",
    src: "audio/red-red-rose-mostly-mono.mp3",
    duration: "2:17"
  }
];

const audio = document.querySelector("#audioPlayer");
const playButton = document.querySelector("#playButton");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const scrubber = document.querySelector("#scrubber");
const elapsedTime = document.querySelector("#elapsedTime");
const totalTime = document.querySelector("#totalTime");
const currentTitle = document.querySelector("#currentTitle");
const currentVersion = document.querySelector("#currentVersion");
const rows = Array.from(document.querySelectorAll("#trackList li"));

let currentIndex = 0;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function fullTrackName(track) {
  return track.version ? `${track.title}, ${track.version}` : track.title;
}

function updatePlaybackState() {
  const isPlaying = !audio.paused;
  playButton.textContent = isPlaying ? "pause" : "play";
  playButton.setAttribute("aria-label", `${isPlaying ? "Pause" : "Play"} ${fullTrackName(tracks[currentIndex])}`);

  rows.forEach((row, index) => {
    const current = index === currentIndex;
    row.classList.toggle("is-current", current);
    const state = row.querySelector(".row-state");
    state.textContent = current && isPlaying ? "pause" : "play";
    row.querySelector("button").setAttribute(
      "aria-label",
      `${current && isPlaying ? "Pause" : "Play"} ${fullTrackName(tracks[index])}`
    );
  });
}

function loadTrack(index, shouldPlay = false) {
  currentIndex = (index + tracks.length) % tracks.length;
  const track = tracks[currentIndex];

  audio.src = track.src;
  currentTitle.textContent = track.title;
  currentVersion.textContent = track.version;
  elapsedTime.textContent = "0:00";
  totalTime.textContent = track.duration;
  scrubber.value = 0;
  updatePlaybackState();

  if (shouldPlay) {
    audio.play().catch(updatePlaybackState);
  }
}

function togglePlayback() {
  if (audio.paused) audio.play().catch(updatePlaybackState);
  else audio.pause();
}

playButton.addEventListener("click", togglePlayback);
previousButton.addEventListener("click", () => loadTrack(currentIndex - 1, true));
nextButton.addEventListener("click", () => loadTrack(currentIndex + 1, true));

rows.forEach((row, index) => {
  row.querySelector("button").addEventListener("click", () => {
    if (index === currentIndex) togglePlayback();
    else loadTrack(index, true);
  });
});

audio.addEventListener("play", updatePlaybackState);
audio.addEventListener("pause", updatePlaybackState);
audio.addEventListener("loadedmetadata", () => {
  totalTime.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  scrubber.value = Math.round((audio.currentTime / audio.duration) * 1000);
  elapsedTime.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("ended", () => loadTrack(currentIndex + 1, true));

scrubber.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (Number(scrubber.value) / 1000) * audio.duration;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.target.matches("button, input, a")) return;
  event.preventDefault();
  togglePlayback();
});

loadTrack(0);
