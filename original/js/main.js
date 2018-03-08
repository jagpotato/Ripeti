const VIDEO_ID = 'tpxVMAu1O0Q';

let player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player('player', {
    height: window.innerHeight,
    width: window.innerWidth,
    videoId: VIDEO_ID,
    playerVars: {
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  player.mute();
  event.target.playVideo();
}

u('#play-button').on('click', function(e) {
  player.playVideo();
});

u('#pause-button').on('click', function(e) {
  player.pauseVideo();
});

window.addEventListener('resize', function(e) {
  player.setSize(window.innerWidth, window.innerHeight);  
});
