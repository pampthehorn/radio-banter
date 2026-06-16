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
    if (track.noInvert === true) {
      trackArtImage.classList.add("no-invert");
    } else {
      trackArtImage.classList.remove("no-invert");
    }
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
      if (iconBtn) {
        // CHANGED: Use CSS spans instead of HTML entities
        iconBtn.innerHTML = isPlaying
          ? '<span class="css-icon-pause"></span>'
          : '<span class="css-icon-play"></span>';
      }
    } else {
      item.classList.remove("active");
      // CHANGED: Use CSS span
      if (iconBtn) iconBtn.innerHTML = '<span class="css-icon-play"></span>';

      if (progressBar) progressBar.style.width = "0%";
      if (timeSpan) timeSpan.textContent = mainTracks[index].duration;
    }
  });
}

function loadTrack(index) {
  if (index >= 0 && index < mainTracks.length) {
    currentTrack = index;
    bookletIndex = index;
    const track = mainTracks[index];
    audioPlayer.src = track.src;

    updateStageContent(bookletIndex);
    audioPlayer.load();
    updatePlaylistVisuals();
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

function createPlaylistItem(track, index) {
  const li = document.createElement("li");

  const progressBar = document.createElement("div");
  progressBar.className = "track-progress-bar";
  li.appendChild(progressBar);

  const contentDiv = document.createElement("div");
  contentDiv.className = "playlist-item-content";

  const iconBtn = document.createElement("div");
  iconBtn.className = "play-icon-btn";
  iconBtn.innerHTML = '<span class="css-icon-play"></span>';

  iconBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentTrack === index) {
      if (audioPlayer.paused) playTrack();
      else pauseTrack();
    } else {
      loadTrack(index);
      playTrack();
    }
  });
  contentDiv.appendChild(iconBtn);

  const titleText = document.createElement("span");
  titleText.textContent = track.title;
  contentDiv.appendChild(titleText);

  const timeSpan = document.createElement("span");
  timeSpan.className = "track-time";
  timeSpan.textContent = track.duration;
  contentDiv.appendChild(timeSpan);

  const downloadLink = document.createElement("a");
  downloadLink.href = track.src;
  downloadLink.download = "";
  downloadLink.textContent = "DL";
  downloadLink.className = "download-link";
  downloadLink.addEventListener("click", (e) => e.stopPropagation());
  contentDiv.appendChild(downloadLink);

  li.appendChild(contentDiv);

  li.addEventListener("click", (e) => {
    const rect = li.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;

    if (currentTrack === index) {
      if (audioPlayer.duration) {
        audioPlayer.currentTime = percentage * audioPlayer.duration;
        if (audioPlayer.paused) playTrack();
      }
    } else {
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

audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const items = playlistList.getElementsByTagName("li");
    const activeItem = items[currentTrack];

    if (activeItem) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      const progressBar = activeItem.querySelector(".track-progress-bar");
      if (progressBar) progressBar.style.width = percent + "%";

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

function scrollToStageMobile() {
  if (window.innerWidth < 768) {
    const stage = document.getElementById("dynamicStage");
    stage.scrollIntoView({ behavior: "instant", block: "start" });
  }
}

document.getElementById("bookletPrevBtn").addEventListener("click", () => {
  bookletIndex = (bookletIndex - 1 + mainTracks.length) % mainTracks.length;
  updateStageContent(bookletIndex);
  scrollToStageMobile();
});

document.getElementById("bookletNextBtn").addEventListener("click", () => {
  bookletIndex = (bookletIndex + 1) % mainTracks.length;
  updateStageContent(bookletIndex);
  scrollToStageMobile();
});

generatePlaylist();
audioPlayer.src = mainTracks[0].src;
updateStageContent(0);

let hasLoggedStart = false;
let trackedMilestones = new Set();
const originalLoadTrack = loadTrack;

loadTrack = function (index) {
  hasLoggedStart = false;
  trackedMilestones.clear();

  if (index >= 0 && index < mainTracks.length) {
    currentTrack = index;
    bookletIndex = index;
    audioPlayer.src = mainTracks[index].src;
    updateStageContent(bookletIndex);
    audioPlayer.load();
    updatePlaylistVisuals();
  }
};

let galleryIndex = 0;
const sliderImage = document.getElementById("sliderImage");
const photoPrevBtn = document.getElementById("photoPrevBtn");
const photoNextBtn = document.getElementById("photoNextBtn");

function updateGalleryImage() {
  sliderImage.style.opacity = 0.5;

  setTimeout(() => {
    sliderImage.src = galleryImages[galleryIndex];
    sliderImage.onload = () => {
      sliderImage.style.opacity = 1;
    };
  }, 150);
}

if (sliderImage && photoPrevBtn && photoNextBtn) {
  photoPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    galleryIndex =
      (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
  });

  photoNextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    galleryIndex = (galleryIndex + 1) % galleryImages.length;
    updateGalleryImage();
  });

  sliderImage.addEventListener("click", () => {
    photoNextBtn.click();
  });

  sliderImage.style.cursor = "pointer";
  sliderImage.style.transition = "opacity 0.3s ease";
}

const waldoWalkonGroup = document.getElementById("waldoWalkonGroup");
const waldoWalkon = document.getElementById("waldoWalkon");
const waldoWalkonAudio = document.getElementById("waldoWalkonAudio");
const waldoWalkonFallback = document.getElementById("waldoWalkonFallback");
const waldoWalkonTrigger = document.getElementById("waldoWalkonTrigger");
const waldoSpeechBubble = document.getElementById("waldoSpeechBubble");
let waldoWalkonPlayed = false;
let waldoAudioPrimed = false;
let waldoAnimationFrame = null;
let waldoMoveInterval = null;
let waldoAnimationStartedAt = 0;
const waldoWalkonDuration = 4.67;
const waldoDesktopTravelDuration = 5.7;
const waldoMobileTravelDuration = 6.8;
const waldoHoldStart = 2.25;
const waldoSpeechStart = 2.65;
const waldoSpeechEnd = 4.25;
const waldoHoldEnd = 4.55;
const waldoLandscapeExitStart = 3.55;
const waldoLandscapeExitEnd = 4.48;
const isTouchApple =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const webmAlphaSupported =
  waldoWalkon &&
  waldoWalkon.canPlayType('video/webm; codecs="vp9"') !== "";
const forceWaldoFallback = new URLSearchParams(window.location.search).has(
  "waldoFallback"
);
const useWaldoFallback = forceWaldoFallback || isTouchApple || !webmAlphaSupported;

function getWaldoTravelDuration() {
  return window.matchMedia("(max-width: 767px)").matches
    ? waldoMobileTravelDuration
    : waldoDesktopTravelDuration;
}

function isShortLandscapeViewport() {
  return window.innerWidth > window.innerHeight && window.innerHeight <= 500;
}

function getWaldoExitStart() {
  return isShortLandscapeViewport() ? waldoLandscapeExitStart : waldoHoldEnd;
}

function getWaldoExitEnd() {
  return isShortLandscapeViewport()
    ? waldoLandscapeExitEnd
    : getWaldoTravelDuration();
}

function getWaldoAnimationEnd() {
  return Math.max(getWaldoExitEnd(), waldoWalkonDuration);
}

function updateWaldoSpeech(elapsed) {
  waldoSpeechBubble?.classList.toggle(
    "is-visible",
    elapsed >= waldoSpeechStart && elapsed <= waldoSpeechEnd
  );
}

document.addEventListener(
  "pointerdown",
  () => {
    primeWaldoAudio();
  },
  { once: true }
);

function primeWaldoAudio() {
  waldoAudioPrimed = true;
  waldoWalkonAudio?.load();
}

function playWaldoAudio() {
  if (!waldoWalkonAudio || !waldoAudioPrimed) return;

  waldoWalkonAudio.pause();
  waldoWalkonAudio.currentTime = 0;
  waldoWalkonAudio.volume = 1;
  waldoWalkonAudio.play().catch(() => {});
}

function stopWaldoAudio() {
  if (!waldoWalkonAudio) return;

  waldoWalkonAudio.pause();
  waldoWalkonAudio.currentTime = 0;
}

function setWaldoProgress(progress) {
  if (!waldoWalkonGroup) return;

  const clamped = Math.max(0, Math.min(progress, 1));
  const visibleMedia = useWaldoFallback ? waldoWalkonFallback : waldoWalkon;
  const groupWidth =
    visibleMedia?.getBoundingClientRect().width || window.innerWidth * 0.4;
  const startX = -groupWidth - window.innerWidth * 0.04;
  const endX = window.innerWidth + window.innerWidth * 0.04;
  const x = startX + (endX - startX) * clamped;
  waldoWalkonGroup.style.transform = `translate3d(${x}px, 0, 0)`;
}

function setWaldoPositionForElapsed(elapsed) {
  if (!waldoWalkonGroup) return;

  const visibleMedia = useWaldoFallback ? waldoWalkonFallback : waldoWalkon;
  const groupWidth =
    visibleMedia?.getBoundingClientRect().width || window.innerWidth * 0.4;
  const startX = -groupWidth - window.innerWidth * 0.04;
  const centerX = (window.innerWidth - groupWidth) / 2;
  const endX = window.innerWidth + window.innerWidth * 0.04;
  const exitStart = getWaldoExitStart();
  const exitEnd = getWaldoExitEnd();

  let x = centerX;
  if (elapsed < waldoHoldStart) {
    const t = Math.max(0, Math.min(elapsed / waldoHoldStart, 1));
    x = startX + (centerX - startX) * t;
  } else if (elapsed > exitStart) {
    const exitDuration = Math.max(exitEnd - exitStart, 0.1);
    const t = Math.max(0, Math.min((elapsed - exitStart) / exitDuration, 1));
    x = centerX + (endX - centerX) * t;
  }

  waldoWalkonGroup.style.transform = `translate3d(${x}px, 0, 0)`;
}

function stopWaldoWalkon() {
  if (waldoAnimationFrame) {
    cancelAnimationFrame(waldoAnimationFrame);
    waldoAnimationFrame = null;
  }
  if (waldoMoveInterval) {
    clearInterval(waldoMoveInterval);
    waldoMoveInterval = null;
  }

  setWaldoPositionForElapsed(getWaldoAnimationEnd());
  waldoWalkonGroup?.classList.remove("is-visible");
  waldoSpeechBubble?.classList.remove("is-visible");
  stopWaldoAudio();
  if (waldoWalkon) waldoWalkon.muted = true;
}

function getWaldoElapsed() {
  if (useWaldoFallback) {
    return (performance.now() - waldoAnimationStartedAt) / 1000;
  }

  return Math.max(
    waldoWalkon?.currentTime || 0,
    (performance.now() - waldoAnimationStartedAt) / 1000
  );
}

function moveWaldoWithVideo() {
  if (!waldoWalkon || !waldoWalkonGroup) return;

  const elapsed = getWaldoElapsed();
  setWaldoPositionForElapsed(elapsed);
  updateWaldoSpeech(elapsed);

  if (elapsed < getWaldoAnimationEnd()) {
    waldoAnimationFrame = requestAnimationFrame(moveWaldoWithVideo);
  } else {
    stopWaldoWalkon();
  }
}

function moveWaldoWithTimer() {
  const elapsed = (performance.now() - waldoAnimationStartedAt) / 1000;
  setWaldoPositionForElapsed(elapsed);
  updateWaldoSpeech(elapsed);

  if (elapsed < getWaldoAnimationEnd()) {
    waldoAnimationFrame = requestAnimationFrame(moveWaldoWithTimer);
  } else {
    stopWaldoWalkon();
  }
}

async function playWaldoWalkon() {
  if (!waldoWalkonGroup || waldoWalkonPlayed) return;

  waldoWalkonPlayed = true;
  setWaldoPositionForElapsed(0);
  updateWaldoSpeech(0);
  waldoAnimationStartedAt = performance.now();
  audioPlayer.pause();

  if (useWaldoFallback) {
    waldoWalkonGroup.classList.add("use-fallback", "is-visible");
    if (waldoWalkonFallback) {
      waldoWalkonFallback.removeAttribute("src");
      waldoWalkonFallback.src = `assets/waldo-walkon.apng?v=21&t=${Date.now()}`;
    }
    waldoAnimationStartedAt = performance.now();
    playWaldoAudio();
    moveWaldoWithTimer();
    waldoMoveInterval = setInterval(moveWaldoWithTimer, 50);
    return;
  }

  waldoWalkon.currentTime = 0;
  waldoWalkon.muted = true;

  try {
    await waldoWalkon.play();
  } catch {
    try {
      await waldoWalkon.play();
    } catch {
      waldoWalkonPlayed = false;
      waldoWalkonGroup?.classList.remove("is-visible");
      return;
    }
  }

  waldoWalkonGroup?.classList.add("is-visible");
  waldoAnimationStartedAt = performance.now();
  playWaldoAudio();
  setWaldoPositionForElapsed(0);
  updateWaldoSpeech(0);
  moveWaldoWithVideo();
  waldoMoveInterval = setInterval(moveWaldoWithVideo, 50);
}

if (
  waldoWalkonGroup &&
  waldoWalkon &&
  waldoWalkonTrigger &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  function checkWaldoTrigger() {
    if (waldoWalkonPlayed) return;

    const rect = waldoWalkonTrigger.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6 && rect.bottom > 0) {
      playWaldoWalkon();
    }
  }

  const waldoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) playWaldoWalkon();
      });
    },
    { rootMargin: "0px 0px -40% 0px", threshold: 0 }
  );

  waldoObserver.observe(waldoWalkonTrigger);
  window.addEventListener("scroll", checkWaldoTrigger, { passive: true });
  window.addEventListener("resize", checkWaldoTrigger);
  window.addEventListener("load", checkWaldoTrigger);
  setTimeout(checkWaldoTrigger, 300);

  waldoWalkon.addEventListener("ended", () => {
    moveWaldoWithVideo();
  });

  waldoWalkon.addEventListener("playing", () => {
    moveWaldoWithVideo();
    if (!waldoMoveInterval) {
      waldoMoveInterval = setInterval(moveWaldoWithVideo, 50);
    }
  });

  waldoWalkon.addEventListener("timeupdate", () => {
    moveWaldoWithVideo();
  });

  waldoWalkon.addEventListener("pause", () => {
    if (!waldoWalkon.ended && waldoAnimationFrame) {
      cancelAnimationFrame(waldoAnimationFrame);
      waldoAnimationFrame = null;
    }
    if (!waldoWalkon.ended && waldoMoveInterval) {
      clearInterval(waldoMoveInterval);
      waldoMoveInterval = null;
    }
  });

}

audioPlayer.addEventListener("play", () => {
  waldoAudioPrimed = true;

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

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("download-link")) {
    const trackTitle = mainTracks[currentTrack].title;
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
