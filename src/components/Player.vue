<template>
  <div id="player">
    <div>
      <youtube id="youtube" :video-id="videoId" :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready"></youtube>
      <div id="cover"></div>
    </div>
    <div id="control">
      <button @click="playVideo" :disabled="isPlayButtonDisabled">play</button>
      <button @click="pauseVideo" :disabled="isPauseButtonDisabled">pause</button>
      <input type="range" v-model="currentMovieTime" min="0" :max="movieDuration" @change="seekMovie">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)

const VIDEO_ID = 'tpxVMAu1O0Q'
// const VIDEO_ID = '4DmWPUhZ8lM'

export default {
  name: 'player',
  data () {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
      videoId: VIDEO_ID,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0
      },
      movieDuration: 1000,
      currentMovieTime: '0',
      isPlayButtonDisabled: false,
      isPauseButtonDisabled: true
    }
  },
  created: function () {
    window.addEventListener('resize', this.resize, false)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resize, false)
  },
  methods: {
    playVideo () {
      this.toggleButton()
      this.player.playVideo()
    },
    pauseVideo () {
      this.toggleButton()
      this.player.pauseVideo()
    },
    resize () {
      this.player.setSize(window.innerWidth, window.innerHeight)
    },
    seekMovie () {
      this.player.seekTo(parseInt(this.currentMovieTime, 10), true)
    },
    toggleButton () {
      this.isPlayButtonDisabled = !this.isPlayButtonDisabled
      this.isPauseButtonDisabled = !this.isPauseButtonDisabled
    },
    ready () {
      this.player.getDuration().then((value) => {
        this.movieDuration = value
        this.player.mute()
        // this.player.playVideo()
      }).catch(() => {
        console.log('error')
      })
    }
  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#youtube, #cover, #control {
  position: absolute;
  top: 0px;
  left: 0px;
}

#youtube {
  z-index: -1;
}

#cover {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 0;
}

#control {
  z-index: 1;
}
</style>
