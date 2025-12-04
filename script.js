let currentTrack = 0;
let wakeLock = null;

const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const playlistList = document.getElementById("playlistList");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const timeDisplay = document.getElementById("timeDisplay");
const trackTitleDisplay = document.getElementById("trackTitle");

const dynamicStage = document.getElementById("dynamicStage");
const trackArtImage = document.getElementById("trackArtImage");

const lyricsPanelScroll = document.getElementById("lyricsPanelScroll");
const lyricsContent = document.getElementById("lyricsContent");
const secondaryImage = document.getElementById("secondaryImage");

const dynamicLyricsTitle = document.getElementById("dynamicLyricsTitle");
const dynamicLyricsBody = document.getElementById("dynamicLyricsBody");

async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null;
    });
  }
}

function updateStageContent(trackIndex) {
  if (trackIndex === undefined) trackIndex = currentTrack;

  const track = mainTracks[trackIndex];

  if (track.title === "Instrumental") {
    trackArtImage.src = "lily/instrumental1.jpg";
  } else {
    trackArtImage.src = track.image;
  }

  if (track.title === "Instrumental") {
    lyricsContent.classList.add("hidden");
    secondaryImage.classList.remove("hidden");
    secondaryImage.src = "lily/instrumental2.jpg";
  } else {
    secondaryImage.classList.add("hidden");
    lyricsContent.classList.remove("hidden");

    dynamicLyricsTitle.innerHTML = `<h2>${track.title}</h2>`;
    const rawLyrics = document.getElementById(track.lyricsId);
    if (rawLyrics) {
      dynamicLyricsBody.innerHTML = rawLyrics.innerHTML;
    } else {
      dynamicLyricsBody.innerHTML = "<p>Lyrics not available.</p>";
    }
    lyricsPanelScroll.scrollTop = 0;
  }
}

function updatePlayerUI() {
  const isPlaying = !audioPlayer.paused;
  const track = mainTracks[currentTrack];

  trackTitleDisplay.textContent =
    (isPlaying ? "▶ " : "▷ ") + "Radio Banter - " + track.title;

  const items = playlistList.getElementsByTagName("li");
  Array.from(items).forEach((item, index) => {
    const icon = item.querySelector(".play-icon");
    if (icon) {
      if (index === currentTrack) {
        item.classList.add("active");
        icon.textContent = isPlaying ? "▶ " : "▷ ";
      } else {
        item.classList.remove("active");
        icon.textContent = "▷ ";
      }
    }
  });
}

function nextTrack() {
  const wasPlaying = !audioPlayer.paused;
  const nextIndex = (currentTrack + 1) % mainTracks.length;
  loadTrack(nextIndex);
  if (wasPlaying) {
    playTrack();
  }
}

function prevTrack() {
  const wasPlaying = !audioPlayer.paused;
  const prevIndex = (currentTrack - 1 + mainTracks.length) % mainTracks.length;
  loadTrack(prevIndex);
  if (wasPlaying) {
    playTrack();
  }
}

function loadTrack(index) {
  if (index >= 0 && index < mainTracks.length) {
    currentTrack = index;
    const track = mainTracks[index];
    audioPlayer.src = track.src;

    updateStageContent(currentTrack);

    audioPlayer.load();
    updatePlayerUI();
  }
}

function playTrack() {
  audioPlayer.play();
  playPauseBtn.innerHTML = "&#10074;&#10074;";
  requestWakeLock();
  updatePlayerUI();
}

function pauseTrack() {
  audioPlayer.pause();
  playPauseBtn.innerHTML = "&#9654;";
  releaseWakeLock();
  updatePlayerUI();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

function createPlaylistItem(track, index, clickHandler) {
  const li = document.createElement("li");

  const titleWrapper = document.createElement("span");
  const iconSpan = document.createElement("span");
  iconSpan.className = "play-icon";
  iconSpan.textContent = "▷ ";
  titleWrapper.appendChild(iconSpan);
  const titleText = document.createTextNode(index + 1 + ". " + track.title);
  titleWrapper.appendChild(titleText);
  li.appendChild(titleWrapper);

  const durationSpan = document.createElement("span");
  durationSpan.textContent = track.duration;
  durationSpan.style.color = "#666";
  durationSpan.style.fontSize = "0.9em";
  li.appendChild(durationSpan);

  const downloadLink = document.createElement("a");
  downloadLink.href = track.src;
  downloadLink.download = "";
  downloadLink.textContent = "Download";
  downloadLink.className = "download-link";
  downloadLink.addEventListener("click", (e) => e.stopPropagation());
  li.appendChild(downloadLink);

  li.addEventListener("click", clickHandler);

  if (window.innerWidth > 768) {
    li.addEventListener("mouseenter", () => {
      updateStageContent(index);
    });

    li.addEventListener("mouseleave", () => {
      updateStageContent(currentTrack);
    });
  }

  return li;
}

function generatePlaylist() {
  mainTracks.forEach((track, index) => {
    const li = createPlaylistItem(track, index, () => {
      loadTrack(index);
      playTrack();
    });
    playlistList.appendChild(li);
  });
}

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

document.getElementById("nextBtn").addEventListener("click", nextTrack);
document.getElementById("prevBtn").addEventListener("click", prevTrack);

audioPlayer.addEventListener("ended", () => {
  releaseWakeLock();
  if (currentTrack < mainTracks.length - 1) {
    const nextIndex = (currentTrack + 1) % mainTracks.length;
    loadTrack(nextIndex);
    playTrack();
  } else {
    pauseTrack();
    audioPlayer.currentTime = 0;
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const progressPercent =
      (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progressPercent + "%";
    timeDisplay.textContent =
      formatTime(audioPlayer.currentTime) +
      " / " +
      formatTime(audioPlayer.duration);
  }
});

progressContainer.addEventListener("click", function (e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;
  if (duration) {
    audioPlayer.currentTime = (clickX / width) * duration;
  }
});

document.addEventListener("visibilitychange", () => {
  if (wakeLock !== null && document.visibilityState === "hidden") {
    releaseWakeLock();
  } else if (!audioPlayer.paused && document.visibilityState === "visible") {
    requestWakeLock();
  }
});

generatePlaylist();
audioPlayer.src = mainTracks[0].src;

updateStageContent(0);

// ==========================================
// GOOGLE ANALYTICS TRACKING LOGIC
// ==========================================

// State variables to prevent duplicate events
let hasLoggedStart = false;
let trackedMilestones = new Set();

// 1. Hook into the existing loadTrack function to reset tracking
const originalLoadTrack = loadTrack;
loadTrack = function (index) {
  // Reset tracking flags for the new song
  hasLoggedStart = false;
  trackedMilestones.clear();

  // Call the original function
  originalLoadTrack(index);
};

// 2. Track "Song Start" (Only fires once per song load)
audioPlayer.addEventListener("play", () => {
  if (!hasLoggedStart) {
    const track = mainTracks[currentTrack];
    gtag("event", "audio_start", {
      event_category: "Audio",
      event_label: track.title,
      song_title: track.title,
      artist: "Radio Banter",
    });
    hasLoggedStart = true;
  }
});

// 3. Track Duration & Progress (10%, 25%, 50%, 75%, 90%)
audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;

  const percent = Math.floor(
    (audioPlayer.currentTime / audioPlayer.duration) * 100
  );
  const track = mainTracks[currentTrack];

  // Define milestones we want to track
  const milestones = [10, 25, 50, 75, 90];

  milestones.forEach((milestone) => {
    if (percent >= milestone && !trackedMilestones.has(milestone)) {
      trackedMilestones.add(milestone);

      gtag("event", "audio_progress", {
        event_category: "Audio",
        event_label: track.title,
        song_title: track.title,
        percent_played: milestone + "%",
        seconds_played: Math.round(audioPlayer.currentTime),
      });
    }
  });
});

// 4. Track "Song Complete"
audioPlayer.addEventListener("ended", () => {
  const track = mainTracks[currentTrack];
  gtag("event", "audio_complete", {
    event_category: "Audio",
    event_label: track.title,
    song_title: track.title,
    duration_seconds: Math.round(audioPlayer.duration),
  });
});

// 5. Track Downloads
// We need to attach listeners to the download links generated in generatePlaylist
// We use a MutationObserver or event delegation because those links are created dynamically.
document.getElementById("playlistList").addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("download-link")) {
    // Find the track title from the parent LI text or index
    const li = e.target.closest("li");
    // Simple way to get text without the "Download" part
    const rawText = li.textContent.replace("Download", "").trim();

    gtag("event", "file_download", {
      event_category: "Engagement",
      event_label: rawText,
      file_extension: "mp3",
      file_name: rawText,
    });
  }
});

// 6. Track External Link Clicks (Instagram/Tickets)
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");
  if (
    link &&
    link.hostname !== window.location.hostname &&
    !link.classList.contains("download-link")
  ) {
    gtag("event", "outbound_click", {
      event_category: "Outbound",
      event_label: link.href,
      transport_type: "beacon",
    });
  }
});
