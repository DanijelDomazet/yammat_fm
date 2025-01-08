var playing = false;

function play(alreadyPlaying = false) {
  playing = true;

  $("#play-btn").hide();

  if (!alreadyPlaying) {
    $("#pause-btn").hide();
    chrome.runtime.sendMessage({action: "play"}, (response) => {
      if (playing) {
        $("#play-btn").hide();
        $("#pause-btn").show();
      }
    });
  } else {
    $("#pause-btn").show();
  }
}

function pause(alreadyPaused = false) {
  playing = false;
  $("#pause-btn").hide();
  $("#play-btn").show();

  if (!alreadyPaused) {
    chrome.runtime.sendMessage({action: "pause"});
  }
}

window.addEventListener("load", () => {
  chrome.runtime.sendMessage({action: "status"}, (response) => {

    let status = response.status;

    if (status === "playing") {
      play(true);
    } else {
      play();
    }

  });
});

$("#play-btn").on("click", () => play());
$("#pause-btn").on("click", () => pause());