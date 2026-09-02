const albums = {
  album: {
    title: "Radio Banter",
    artwork: "../lily/newscanscropped/Front Cover.png"
  },
  single: {
    title: "Up on Kingussie Avenue",
    artwork: "../lily/newscanscropped/Grown In Love - just heart.png"
  }
};

const tracks = [
  { id: 1, title: "Nature Nurture", seconds: 285, duration: "4:45", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/01 Nature Nurture.mp3" },
  { id: 2, title: "Growing in Love", seconds: 209, duration: "3:29", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/02 Growing in Love.mp3" },
  { id: 3, title: "Harsh but Fair", seconds: 185, duration: "3:05", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/03 Harsh but Fair.mp3" },
  { id: 4, title: "Richmond", seconds: 236, duration: "3:56", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/04 Richmond.mp3" },
  { id: 5, title: "End of an Era", seconds: 155, duration: "2:35", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/05 End of an Era.mp3" },
  { id: 6, title: "Ghostie", seconds: 143, duration: "2:23", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/06 Ghosty.mp3" },
  { id: 7, title: "Doctor", seconds: 159, duration: "2:39", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/07 Doctor.mp3" },
  { id: 8, title: "Instrumental", seconds: 160, duration: "2:40", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/08 Instrumental.mp3" },
  { id: 9, title: "The Groove", seconds: 180, duration: "3:00", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/09 The Groove.mp3" },
  { id: 10, title: "Financial Crash", seconds: 157, duration: "2:37", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/10 Financial Crash.mp3" },
  { id: 11, title: "AI", seconds: 172, duration: "2:52", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/ai.mp3" },
  { id: 12, title: "Viva Palestine", seconds: 82, duration: "1:22", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/viva-palestine.mp3" },
  { id: 13, title: "Red Red Rose", seconds: 137, duration: "2:17", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/red-red-rose-mostly-mono.mp3" }
];

const audio = document.querySelector("#audioPlayer");
const playButton = document.querySelector("#playButton");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const volumeSlider = document.querySelector("#volumeSlider");
const scrubber = document.querySelector("#scrubber");
const displayTitle = document.querySelector("#displayTitle");
const elapsedTime = document.querySelector("#elapsedTime");
const totalTime = document.querySelector("#totalTime");
const searchInput = document.querySelector("#searchInput");
const browseButton = document.querySelector("#browseButton");
const browserPanel = document.querySelector("#browserPanel");
const tableBody = document.querySelector("#trackTableBody");
const emptyMessage = document.querySelector("#emptyMessage");
const statusText = document.querySelector("#statusText");
const sourceArtwork = document.querySelector("#sourceArtwork");
const filterButtons = Array.from(document.querySelectorAll("[data-album]"));

let selectedAlbum = "all";
let selectedIndex = 0;
let loadedIndex = 0;
let searchTerm = "";

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function visibleIndexes() {
  return tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => {
      const matchesAlbum = selectedAlbum === "all" || track.albumId === selectedAlbum;
      const haystack = `${track.title} ${track.album} Radio Banter ${track.genre}`.toLowerCase();
      return matchesAlbum && haystack.includes(searchTerm);
    })
    .map(({ index }) => index);
}

function renderTable() {
  const indexes = visibleIndexes();
  const isPlaying = !audio.paused;

  tableBody.innerHTML = indexes.map((index) => {
    const track = tracks[index];
    const selected = index === selectedIndex;
    const playing = index === loadedIndex && isPlaying;
    return `
      <tr data-index="${index}" class="${selected ? "is-selected" : ""} ${playing ? "is-playing" : ""}" aria-selected="${selected}">
        <td class="playing-cell" aria-label="${playing ? "Playing" : ""}"></td>
        <td><button class="song-button" type="button" data-index="${index}">${track.title}</button></td>
        <td class="time-cell">${track.duration}</td>
        <td>Radio Banter</td>
        <td>${track.album}</td>
        <td>${track.genre}</td>
      </tr>`;
  }).join("");

  emptyMessage.hidden = indexes.length !== 0;
  const totalSeconds = indexes.reduce((sum, index) => sum + tracks[index].seconds, 0);
  statusText.textContent = `${indexes.length} ${indexes.length === 1 ? "song" : "songs"}, ${formatTime(totalSeconds)} total time`;
}

function updateFilterControls() {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.album === selectedAlbum);
  });

  sourceArtwork.src = selectedAlbum === "single"
    ? albums.single.artwork
    : albums.album.artwork;
}

function selectAlbum(albumId) {
  selectedAlbum = albumId;
  updateFilterControls();
  renderTable();
}

function loadTrack(index, shouldPlay = false) {
  selectedIndex = index;
  loadedIndex = index;
  const track = tracks[index];

  audio.src = track.src;
  displayTitle.textContent = track.title;
  totalTime.textContent = track.duration;
  elapsedTime.textContent = "0:00";
  scrubber.value = 0;
  sourceArtwork.src = albums[track.albumId].artwork;
  renderTable();
  updatePlaybackControls();

  if (shouldPlay) audio.play().catch(updatePlaybackControls);
}

function updatePlaybackControls() {
  const playing = !audio.paused;
  playButton.classList.toggle("is-playing", playing);
  playButton.setAttribute("aria-label", playing ? "Pause" : "Play");
  renderTable();
}

function togglePlayback() {
  if (selectedIndex !== loadedIndex) {
    loadTrack(selectedIndex, true);
    return;
  }
  if (audio.paused) audio.play().catch(updatePlaybackControls);
  else audio.pause();
}

function adjacentTrack(direction) {
  const indexes = visibleIndexes();
  if (!indexes.length) return;
  const currentPosition = indexes.indexOf(loadedIndex);
  const safePosition = currentPosition === -1 ? 0 : currentPosition;
  const nextPosition = (safePosition + direction + indexes.length) % indexes.length;
  loadTrack(indexes[nextPosition], true);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => selectAlbum(button.dataset.album));
});

tableBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) return;
  selectedIndex = Number(row.dataset.index);
  if (selectedIndex !== loadedIndex || !audio.src) loadTrack(selectedIndex, false);
  else renderTable();
});

tableBody.addEventListener("dblclick", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (row) loadTrack(Number(row.dataset.index), true);
});

playButton.addEventListener("click", togglePlayback);
previousButton.addEventListener("click", () => adjacentTrack(-1));
nextButton.addEventListener("click", () => adjacentTrack(1));

volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
});

scrubber.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (Number(scrubber.value) / 1000) * audio.duration;
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderTable();
});

browseButton.addEventListener("click", () => {
  const willShow = browserPanel.hidden;
  browserPanel.hidden = !willShow;
  browseButton.classList.toggle("is-active", willShow);
  browseButton.setAttribute("aria-pressed", String(willShow));
});

audio.addEventListener("play", updatePlaybackControls);
audio.addEventListener("pause", updatePlaybackControls);
audio.addEventListener("loadedmetadata", () => {
  totalTime.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  scrubber.value = Math.round((audio.currentTime / audio.duration) * 1000);
  elapsedTime.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("ended", () => adjacentTrack(1));

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.target.matches("input, button")) return;
  event.preventDefault();
  togglePlayback();
});

audio.volume = Number(volumeSlider.value);
loadTrack(0);
updateFilterControls();
