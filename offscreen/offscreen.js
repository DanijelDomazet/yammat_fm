var audio = null;
var isPlaying = false;
var tryingToPlay = false;


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
}