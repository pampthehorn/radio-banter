let currentTrack = 0;
let wakeLock = null;
let bookletIndex = 0;
const audioPlayer = document.getElementById("audioPlayer");
const playlistList = document.getElementById("playlistList");

const trackArtImage = document.getElementById("trackArtImage");
const lyricsPanelScroll = document.getElementById("lyricsPanelScroll");
const lyricsContent = document.getElementById("lyricsContent");
const secondaryImage = document.getElementById("secondaryImage");
const dynamicLyricsTitle = document.getElementById("dynamicLyricsTitle");
const dynamicLyricsBody = document.getElementById("dynamicLyricsBody");

// --- Wake Lock Functions ---
async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      console.error(err);
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

// --- UI Updates ---

function updateStageContent(trackIndex) {
  if (trackIndex === undefined) trackIndex = currentTrack;
  const track = mainTracks[trackIndex];

  if (track.title === "Instrumental") {
    trackArtImage.src = "lily/instrumental1.jpg";
    lyricsContent.classList.add("hidden");
    secondaryImage.classList.remove("hidden");
    secondaryImage.src = "lily/instrumental2.jpg";
  } else {
    trackArtImage.src = track.image;
    secondaryImage.classList.add("hidden");
    lyricsContent.classList.remove("hidden");
    dynamicLyricsTitle.innerHTML = `<h2>${track.title}</h2>`;
    const rawLyrics = document.getElementById(track.lyricsId);
    dynamicLyricsBody.innerHTML = rawLyrics
      ? rawLyrics.innerHTML
      : "<p>Lyrics not available.</p>";
    lyricsPanelScroll.scrollTop = 0;
  }
}

function updatePlaylistVisuals() {
  const items = playlistList.getElementsByTagName("li");
  const isPlaying = !audioPlayer.paused;

  Array.from(items).forEach((item, index) => {
    const iconBtn = item.querySelector(".play-icon-btn");
    const progressBar = item.querySelector(".track-progress-bar");
    const timeSpan = item.querySelector(".track-time");

    if (index === currentTrack) {
      item.classList.add("active");
      // Swap Icon: Triangle (Play) vs Double Bars (Pause)
      if (iconBtn)
        iconBtn.innerHTML = isPlaying ? "&#10074;&#10074;" : "&#9654;";
    } else {
      item.classList.remove("active");
      if (iconBtn) iconBtn.innerHTML = "&#9654;"; // Always Play triangle for inactive tracks

      // Reset inactive tracks
      if (progressBar) progressBar.style.width = "0%";
      if (timeSpan) timeSpan.textContent = mainTracks[index].duration;
    }
  });
}

// --- Player Logic ---

function loadTrack(index) {
  if (index >= 0 && index < mainTracks.length) {
    currentTrack = index;
    bookletIndex = index;
    const track = mainTracks[index];
    audioPlayer.src = track.src;

    updateStageContent(bookletIndex);
    audioPlayer.load();
    updatePlaylistVisuals(); // Update icons immediately
  }
}

function playTrack() {
  audioPlayer.play().catch((e) => console.log("Playback interaction needed"));
  requestWakeLock();
  updatePlaylistVisuals();
}

function pauseTrack() {
  audioPlayer.pause();
  releaseWakeLock();
  updatePlaylistVisuals();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return minutes + ":" + (secs < 10 ? "0" : "") + secs;
}

// --- Playlist Generation ---

function createPlaylistItem(track, index) {
  const li = document.createElement("li");

  // 1. Progress Bar (Background)
  const progressBar = document.createElement("div");
  progressBar.className = "track-progress-bar";
  li.appendChild(progressBar);

  // 2. Content Wrapper
  const contentDiv = document.createElement("div");
  contentDiv.className = "playlist-item-content";

  // Play/Pause Button (The Icon)
  const iconBtn = document.createElement("div");
  iconBtn.className = "play-icon-btn";
  iconBtn.innerHTML = "&#9654;"; // Default Play Triangle

  // ICON CLICK LOGIC
  iconBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Stop bubble so we don't trigger scrub
    if (currentTrack === index) {
      if (audioPlayer.paused) playTrack();
      else pauseTrack();
    } else {
      loadTrack(index);
      playTrack();
    }
  });
  contentDiv.appendChild(iconBtn);

  // Track Title
  const titleText = document.createElement("span");
  titleText.textContent = track.title;
  contentDiv.appendChild(titleText);

  // Timer
  const timeSpan = document.createElement("span");
  timeSpan.className = "track-time";
  timeSpan.textContent = track.duration;
  contentDiv.appendChild(timeSpan);

  // Download Link
  const downloadLink = document.createElement("a");
  downloadLink.href = track.src;
  downloadLink.download = "";
  downloadLink.textContent = "DL";
  downloadLink.className = "download-link";
  // Stop bubble so clicking download doesn't play/scrub
  downloadLink.addEventListener("click", (e) => e.stopPropagation());
  contentDiv.appendChild(downloadLink);

  li.appendChild(contentDiv);

  // 3. Main LI Click (Scrubbing Logic)
  li.addEventListener("click", (e) => {
    const rect = li.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    if (currentTrack === index) {
      // Scrub active track
      if (audioPlayer.duration) {
        audioPlayer.currentTime = percentage * audioPlayer.duration;
        if (audioPlayer.paused) playTrack(); // Optional: Auto-play on scrub
      }
    } else {
      // Clicked different track body -> Load and Play
      loadTrack(index);
      playTrack();
    }
  });

  if (window.innerWidth > 768) {
    li.addEventListener("mouseenter", () => updateStageContent(index));
    li.addEventListener("mouseleave", () => updateStageContent(currentTrack));
  }

  return li;
}

function generatePlaylist() {
  playlistList.innerHTML = "";
  mainTracks.forEach((track, index) => {
    playlistList.appendChild(createPlaylistItem(track, index));
  });
}

// --- Audio Events ---

audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const items = playlistList.getElementsByTagName("li");
    const activeItem = items[currentTrack];

    if (activeItem) {
      // Update Bar Width
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      const progressBar = activeItem.querySelector(".track-progress-bar");
      if (progressBar) progressBar.style.width = percent + "%";

      // Update Time Text (Rolling Timer)
      const timeSpan = activeItem.querySelector(".track-time");
      if (timeSpan) timeSpan.textContent = formatTime(audioPlayer.currentTime);
    }
  }
});

audioPlayer.addEventListener("ended", () => {
  releaseWakeLock();
  if (currentTrack < mainTracks.length - 1) {
    const nextIndex = (currentTrack + 1) % mainTracks.length;
    loadTrack(nextIndex);
    playTrack();
  } else {
    pauseTrack();
    audioPlayer.currentTime = 0;
    updatePlaylistVisuals();
  }
});

// Booklet Controls
document.getElementById("bookletPrevBtn").addEventListener("click", () => {
  bookletIndex = (bookletIndex - 1 + mainTracks.length) % mainTracks.length;
  updateStageContent(bookletIndex);
});

document.getElementById("bookletNextBtn").addEventListener("click", () => {
  bookletIndex = (bookletIndex + 1) % mainTracks.length;
  updateStageContent(bookletIndex);
});

// Initialize
generatePlaylist();
audioPlayer.src = mainTracks[0].src;
updateStageContent(0);

// --- GA Tracking (Kept simplified for brevity, works same as before) ---
let hasLoggedStart = false;
let trackedMilestones = new Set();
const originalLoadTrack = loadTrack;

loadTrack = function (index) {
  hasLoggedStart = false;
  trackedMilestones.clear();

  // Execute original logic manually to avoid recursion
  if (index >= 0 && index < mainTracks.length) {
    currentTrack = index;
    bookletIndex = index;
    audioPlayer.src = mainTracks[index].src;
    updateStageContent(bookletIndex);
    audioPlayer.load();
    updatePlaylistVisuals();
  }
};

audioPlayer.addEventListener("play", () => {
  if (!hasLoggedStart) {
    const track = mainTracks[currentTrack];
    if (typeof gtag === "function") {
      gtag("event", "audio_start", {
        event_category: "Audio",
        event_label: track.title,
        song_title: track.title,
        artist: "Radio Banter",
      });
    }
    hasLoggedStart = true;
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!audioPlayer.duration) return;
  const percent = Math.floor(
    (audioPlayer.currentTime / audioPlayer.duration) * 100
  );
  const track = mainTracks[currentTrack];
  const milestones = [10, 25, 50, 75, 90];

  milestones.forEach((milestone) => {
    if (percent >= milestone && !trackedMilestones.has(milestone)) {
      trackedMilestones.add(milestone);
      if (typeof gtag === "function") {
        gtag("event", "audio_progress", {
          event_category: "Audio",
          event_label: track.title,
          song_title: track.title,
          percent_played: milestone + "%",
          seconds_played: Math.round(audioPlayer.currentTime),
        });
      }
    }
  });
});

audioPlayer.addEventListener("ended", () => {
  const track = mainTracks[currentTrack];
  if (typeof gtag === "function") {
    gtag("event", "audio_complete", {
      event_category: "Audio",
      event_label: track.title,
      song_title: track.title,
      duration_seconds: Math.round(audioPlayer.duration),
    });
  }
});

// GA: Download and Outbound Link tracking
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("download-link")) {
    const trackTitle = mainTracks[currentTrack].title;
    // Note: Logic slightly adjusted as the link is now inside the LI
    if (typeof gtag === "function") {
      gtag("event", "file_download", {
        event_category: "Engagement",
        event_label: trackTitle,
        file_extension: "mp3",
        file_name: trackTitle,
      });
    }
  }

  const link = e.target.closest("a");
  if (
    link &&
    link.hostname !== window.location.hostname &&
    !link.classList.contains("download-link")
  ) {
    if (typeof gtag === "function") {
      gtag("event", "outbound_click", {
        event_category: "Outbound",
        event_label: link.href,
        transport_type: "beacon",
      });
    }
  }
});
