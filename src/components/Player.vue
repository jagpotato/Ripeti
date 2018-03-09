<template>
  <div id="player">
    <div>
      <youtube id="youtube" :video-id="videoId" :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="readyAction"></youtube>
      <div id="cover"></div>
    </div>
    <div id="control">
      <button @click="playButtonAction" :disabled="isPlayButtonDisabled">play</button>
      <button @click="pauseButtonAction" :disabled="isPauseButtonDisabled">pause</button>
      <input type="range" v-model="currentMovieTime" min="0" :max="movieDuration">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueYoutube from 'vue-youtube'
import {mapActions} from 'vuex'

Vue.use(VueYoutube)

export default {
  name: 'player',
  created: mapActions('Player', [
    'addEventAction'
  ]),
  beforeDestroy: mapActions('Player', [
    'removeEventAction'
  ]),
  methods: mapActions('Player', [
    'readyAction',
    'playButtonAction',
    'pauseButtonAction'
  ]),
  computed: {
    videoId: {
      get () {
        return this.$store.state.videoId
      }
    },
    height: {
      get () {
        return this.$store.state.height
      }
    },
    width: {
      get () {
        return this.$store.state.width
      }
    },
    playerVars: {
      get () {
        return this.$store.state.playerVars
      }
    },
    currentMovieTime: {
      get () {
        return this.$store.state.currentMovieTime
      },
      set (value) {
        this.$store.commit('seekMovie', value)
      }
    },
    movieDuration: {
      get () {
        return this.$store.state.movieDuration
      }
    },
    isPlayButtonDisabled: {
      get () {
        return this.$store.state.isPlayButtonDisabled
      }
    },
    isPauseButtonDisabled: {
      get () {
        return this.$store.state.isPauseButtonDisabled
      }
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
