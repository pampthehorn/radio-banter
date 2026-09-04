const albums = {
  album: {
    title: "Radio Banter",
    artwork: "../lily/newscanscropped/Front Cover.png"
  },
  single: {
    title: "Up on Kingussie Avenue",
    artwork: "artwork/up-on-kingussie-avenue.jpg"
  }
};

const lyricsByTrackId = {
  11: [
    ["Did you write this in a prompt", "Have you made it with AI", "naw man, you saying I could, could I"],
    ["When you say apparently", "Cos you heard it in a dream", "And you don't know what it means"],
    ["When we're plagued by killer drones", "And we can't go on our phones", "And we can't be rolling stones"],
    ["When we tried to save your jobs", "But the books were at a loss", "And we had to cut the costs"],
    ["Did you write this in a prompt", "Have you made it with AI", "naw man, you saying I should, should I"]
  ],
  12: [
    ["Viva viva Palestina, viva viva Palestine", "Viva viva Palestina, free free Palestine"],
    ["From the river to the sea", "Palestinians should be free"],
    ["1234, Occupation no more", "5678, Israel's a terror state"],
    ["Netanyahu you can't hide", "You've committed genocide", "Keir Starmer you can't hide", "We've supplied a genocide"],
    ["Shame on you Keir Starmer", "Shame on you Netanyahu"]
  ],
  13: [
    ["Oh my love's like a red red rose", "Oh my love is like the melody that is sweetly played in tune"],
    ["So fair art thou, my bonnie lass", "So deep in love am I", "I'll love thee still my dear, til the sea's gang dry"],
    ["Til the sea's gang dry my dear", "And rocks will melt with the sun", "I'll love thee still my dear, til the sand's o' life shall run"],
    ["So fair thee weel, my only love", "And Fair thee weel a while", "I'll come again my love", "Though it were 10,000 mile"]
  ],
  1: [
    ["is it nature is it nurture", "this funky feeling that funky beat", "is it nature or is it nurture", "the reason for this rhythm in my feet", "is it nature or is it nurture", "people are so angry in the street", "is it nature or is it nurture", "people are just voting with their feet"],
    ["don't be rude, don't be rude"],
    ["is it nature or is it nurture", "to argue with your mother's point of view", "is it nature or is it nurture", "to read beyond the headlines of the news"],
    ["part of me felt we done too much", "part of me felt we never done enough"]
  ],
  2: [
    ["Oh no what to do", "i've gone and grown feelings for you", "i'm gonna have to", "water them now, keep them fed", "pull the weeds from, from their bed", "give them sunshine, give them shade", "use a trowel, use a spade"],
    ["aw man it's every day", "put my shoes on", "and it starts to rain", "let's see how it looks in an hour"],
    ["it's not always", "the shoots will find their way", "it's not always", "the shrubs will see the day"],
    ["oh no what to do", "i've grown in love with you"]
  ],
  3: [
    ["people tell me", "because of my age", "i should rein it in", "i should pare it back", "people tell me people tell me people tell me"],
    ["to look out of the window", "and what do you see", "the war is still raging", "there'll never be peace"]
  ],
  4: [
    ["if we don't come off the gas that we emit", "and all we do are these carbon offsets", "is that really us playing our part", "is it wise to be so smart", "if we don't just stop oil", "the whole sea's gang come to a boil", "there'll be mammals washed up on our shores", "children seeking refuge at our doors", "and they'll be asking why do we only get our bit", "once you've taken all the good things out of it"],
    ["if we don't stop ourselves", "we don't leave anybody else", "the chance to", "the opportunity", "not to"]
  ],
  5: [
    ["oops nope well that’s unfortch’", "i forgot to pack the propane torch", "do you need a good bag from the bakery", "before telling us your tales of bravery", "stories of old from oh so many years ago", "isn’t hindsight a wonderful thing", "when one has found one’s flow"],
    ["the realms in which we are being", "sometimes seeing is believing", "yet, how can one quell this emotional swell?", "please pass the magic potion,", "we can cancel out the spell", "only time will really tell", "could this be", "the end of an era?"]
  ],
  6: [
    ["the moon lit a bed of freshly fell snow", "my family slept as i made them soup by the stove", "someone's knockin on my door"],
    ["out there's a young man wearing old man's clothes", "he says he lives here and my love is his", "i send him walking in the snow man"],
    ["i can't sleep so i go back outside", "where did he come from, which way did he go", "there are no footprints in the snow"]
  ],
  7: [
    ["i feel so lazy doctor can you diagnose why", "i'll sing anything i got til it gets me a line"],
    ["i feel so crazy lately are you loving me why", "i'll do anything for you papa you gave me my life"],
    ["oh my god i am so tired", "even though i have slept for 12 hours", "often that is just what happens", "you oversleep and it makes you more tired", "you oversleep and it makes you more tired"],
    ["jesus christ i am so hungry", "gonna go home now i've spent all my money"]
  ],
  9: [
    ["you've got to get in to the groove", "that's the whole point of this song", "this song is so groovy", "they're making it in to a movie"],
    ["so when i die", "there will be stars", "in the sky", "when i die", "you've got to get in to the groove"]
  ],
  10: [
    ["it's all my fault", "i took the decision", "it's all because of me", "it's my responsibility"],
    ["i need some inspiration", "to make a meal", "is there any point though", "when all you want's a pie"]
  ]
};

const tracks = [
  { id: 11, title: "AI", seconds: 172, duration: "2:52", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/ai.mp3", artwork: "artwork/up-on-kingussie-avenue.jpg" },
  { id: 12, title: "Viva Palestine", seconds: 82, duration: "1:22", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/viva-palestine.mp3", artwork: "artwork/up-on-kingussie-avenue.jpg" },
  { id: 13, title: "Red Red Rose", seconds: 137, duration: "2:17", albumId: "single", album: "Up on Kingussie Avenue", genre: "Scottish DIY", src: "../red-red-rose-preview/audio/red-red-rose-mostly-mono.mp3", artwork: "artwork/up-on-kingussie-avenue.jpg" },
  { id: 1, title: "Nature Nurture", seconds: 285, duration: "4:45", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/01 Nature Nurture.mp3", artwork: "../lily/newscanscropped/Nature Nurture.png" },
  { id: 2, title: "Growing in Love", seconds: 209, duration: "3:29", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/02 Growing in Love.mp3", artwork: "../lily/newscanscropped/Grown In Love.png" },
  { id: 3, title: "Harsh but Fair", seconds: 185, duration: "3:05", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/03 Harsh but Fair.mp3", artwork: "../lily/newscanscropped/Harsh But Fair.png" },
  { id: 4, title: "Richmond", seconds: 236, duration: "3:56", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/04 Richmond.mp3", artwork: "../lily/newscanscropped/Richmond.png" },
  { id: 5, title: "End of an Era", seconds: 155, duration: "2:35", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/05 End of an Era.mp3", artwork: "../lily/newscanscropped/End Of An Era.png" },
  { id: 6, title: "Ghostie", seconds: 143, duration: "2:23", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/06 Ghosty.mp3", artwork: "../lily/newscanscropped/Ghostie.png" },
  { id: 7, title: "Doctor", seconds: 159, duration: "2:39", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/07 Doctor.mp3", artwork: "../lily/newscanscropped/Doctor.png" },
  { id: 8, title: "Instrumental", seconds: 160, duration: "2:40", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/08 Instrumental.mp3", artwork: "../lily/newscanscropped/Instrumental 1.png" },
  { id: 9, title: "The Groove", seconds: 180, duration: "3:00", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/09 The Groove.mp3", artwork: "../lily/newscanscropped/The Groove.png" },
  { id: 10, title: "Financial Crash", seconds: 157, duration: "2:37", albumId: "album", album: "Radio Banter", genre: "Scottish DIY", src: "../20250823masters/10 Financial Crash.mp3", artwork: "../lily/newscanscropped/Financial Crash.png" }
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
const tableBody = document.querySelector("#trackTableBody");
const emptyMessage = document.querySelector("#emptyMessage");
const statusText = document.querySelector("#statusText");
const sourceArtwork = document.querySelector("#sourceArtwork");
const artworkButton = document.querySelector("#artworkButton");
const artworkDialog = document.querySelector("#artworkDialog");
const artworkDialogTitle = document.querySelector("#artworkDialogTitle");
const modalArtwork = document.querySelector("#modalArtwork");
const closeArtworkButton = document.querySelector("#closeArtworkButton");
const lyricsButton = document.querySelector("#lyricsButton");
const lyricsDialog = document.querySelector("#lyricsDialog");
const lyricsTitle = document.querySelector("#lyricsTitle");
const lyricsText = document.querySelector("#lyricsText");
const closeLyricsButton = document.querySelector("#closeLyricsButton");
const filterButtons = Array.from(document.querySelectorAll("[data-album]"));

let selectedAlbum = "all";
let selectedIndex = 0;
let loadedIndex = -1;
let searchTerm = "";
let lyricsTrackIndex = -1;

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
      </tr>`;
  }).join("");

  emptyMessage.hidden = indexes.length !== 0;
  const totalSeconds = indexes.reduce((sum, index) => sum + tracks[index].seconds, 0);
  statusText.textContent = `${indexes.length} ${indexes.length === 1 ? "song" : "songs"}, ${formatTime(totalSeconds)} total time`;
}

function updateLyricsLauncher(trackIndex) {
  const track = tracks[trackIndex];
  const hasLyrics = Boolean(track && lyricsByTrackId[track.id]?.length);
  lyricsTrackIndex = hasLyrics ? trackIndex : -1;
  lyricsButton.hidden = !hasLyrics;
  if (hasLyrics) lyricsButton.setAttribute("aria-label", `View lyrics for ${track.title}`);
}

function setArtwork(src, label, trackIndex = -1) {
  sourceArtwork.src = src;
  sourceArtwork.alt = label;
  artworkButton.setAttribute("aria-label", `View ${label} larger`);
  modalArtwork.src = src;
  modalArtwork.alt = label;
  artworkDialogTitle.textContent = label;
  updateLyricsLauncher(trackIndex);
}

function openLyrics() {
  const track = tracks[lyricsTrackIndex];
  const stanzas = track && lyricsByTrackId[track.id];
  if (!track || !stanzas) return;

  lyricsTitle.textContent = track.title;
  const paragraphs = stanzas.map((stanza) => {
    const paragraph = document.createElement("p");
    stanza.forEach((line, index) => {
      if (index) paragraph.append(document.createElement("br"));
      paragraph.append(line);
    });
    return paragraph;
  });
  lyricsText.replaceChildren(...paragraphs);
  lyricsDialog.showModal();
}

function updateRowSelection() {
  tableBody.querySelectorAll("tr[data-index]").forEach((row) => {
    const selected = Number(row.dataset.index) === selectedIndex;
    row.classList.toggle("is-selected", selected);
    row.setAttribute("aria-selected", String(selected));
  });
}

function updateFilterControls() {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.album === selectedAlbum);
  });
}

function selectAlbum(albumId) {
  selectedAlbum = albumId;
  const indexes = visibleIndexes();
  if (!indexes.includes(selectedIndex)) selectedIndex = indexes[0] ?? -1;
  updateFilterControls();
  renderTable();

  if (!audio.paused && loadedIndex >= 0) {
    const playingTrack = tracks[loadedIndex];
    setArtwork(playingTrack.artwork, `${playingTrack.title} artwork`, loadedIndex);
    return;
  }

  const release = albumId === "album" ? albums.album : albums.single;
  setArtwork(release.artwork, `${release.title} cover artwork`);
}

function loadTrack(index, shouldPlay = false) {
  if (!tracks[index]) return;
  selectedIndex = index;
  loadedIndex = index;
  const track = tracks[index];

  audio.src = track.src;
  displayTitle.textContent = track.title;
  totalTime.textContent = track.duration;
  elapsedTime.textContent = "0:00";
  scrubber.value = 0;
  setArtwork(track.artwork, `${track.title} artwork`, index);
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
  if (selectedIndex < 0) return;
  if (selectedIndex !== loadedIndex || !audio.src) {
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
  if (currentPosition === -1) {
    loadTrack(indexes[direction > 0 ? 0 : indexes.length - 1], true);
    return;
  }
  const nextPosition = (currentPosition + direction + indexes.length) % indexes.length;
  loadTrack(indexes[nextPosition], true);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => selectAlbum(button.dataset.album));
});

tableBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) return;
  selectedIndex = Number(row.dataset.index);
  const track = tracks[selectedIndex];
  setArtwork(track.artwork, `${track.title} artwork`, selectedIndex);
  updateRowSelection();
});

tableBody.addEventListener("dblclick", (event) => {
  const row = event.target.closest("tr[data-index]");
  if (!row) return;
  event.preventDefault();
  loadTrack(Number(row.dataset.index), true);
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
  const indexes = visibleIndexes();
  if (!indexes.includes(selectedIndex)) selectedIndex = indexes[0] ?? -1;
  renderTable();
  if (selectedIndex >= 0 && audio.paused) {
    const track = tracks[selectedIndex];
    setArtwork(track.artwork, `${track.title} artwork`, selectedIndex);
  }
});

artworkButton.addEventListener("click", () => artworkDialog.showModal());
closeArtworkButton.addEventListener("click", () => artworkDialog.close());
artworkDialog.addEventListener("click", (event) => {
  if (event.target === artworkDialog) artworkDialog.close();
});

lyricsButton.addEventListener("click", openLyrics);
closeLyricsButton.addEventListener("click", () => lyricsDialog.close());
lyricsDialog.addEventListener("click", (event) => {
  if (event.target === lyricsDialog) lyricsDialog.close();
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
updateFilterControls();
renderTable();
setArtwork(albums.single.artwork, `${albums.single.title} cover artwork`);
