var audio = null;
var isPlaying = false;
var tryingToPlay = false;

async function setActionIcon(state) {
  try {
    // Request the service worker to update the toolbar icon.
    await chrome.runtime.sendMessage({ action: "set_icon", state });
  } catch (e) {
    console.warn("Failed to request action icon change:", e);
  }
}


chrome.runtime.onMessage.addListener((message, sender, callback) => {
  if (message.action === "play") {
    console.info("Play requested", isPlaying);
    if (isPlaying || tryingToPlay) {
      console.info("Already playing!");
      callback(true);
      return false;
    }

    tryingToPlay = true;
    playAudio();

    audio.play().then(() => {
      console.info("Playing!");
      isPlaying = true;
      tryingToPlay = false;
      setActionIcon("playing");
      callback(true);
    }).catch((err) => {
      tryingToPlay = false;
      callback(false);
    });
    return true;
  } else if (message.action === "pause") {
    console.info("pause");
    tryingToPlay = false;
    isPlaying = false;

    setActionIcon("paused");

    if (audio) {
      audio.pause();
    }
  } else if (message.action === "status") {
    callback({
      status: isPlaying ? "playing" : "paused"
    });
  }
});

function playAudio() {
  audio = new Audio("http://stream.yammat.fm:8000/yammat.mp3");

  // If playback stops or fails, revert the icon so you don't get trolled all day.
  audio.addEventListener("pause", () => {
    isPlaying = false;
    tryingToPlay = false;
    setActionIcon("paused");
  });

  audio.addEventListener("ended", () => {
    isPlaying = false;
    tryingToPlay = false;
    setActionIcon("paused");
  });

  audio.addEventListener("error", () => {
    isPlaying = false;
    tryingToPlay = false;
    setActionIcon("paused");
  });
}