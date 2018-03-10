<template>
  <div id="player">
    <div>
      <youtube id="youtube" :video-id="videoId" :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready"></youtube>
      <div id="cover"></div>
    </div>
    <div id="control">
      <button @click="playButtonAction" :disabled="isPlayButtonDisabled">play</button>
      <button @click="pauseButtonAction" :disabled="isPauseButtonDisabled">pause</button>
      <input id="seekbar" type="range" v-model="currentMovieTime" min="0" :max="movieDuration">
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'player',
  beforeDestroy: function () {
    this.$store.dispatch('Player/removeEventAction')
  },
  methods: {
    ready () {
      this.$store.dispatch('Player/readyAction', {
        value: this.$refs.youtube.player
      })
      this.$store.dispatch('Controller/initButtonAction')
    },
    ...mapActions('Controller', [
      'playButtonAction',
      'pauseButtonAction'
    ])
  },
  computed: {
    currentMovieTime: {
      get () {
        return this.$store.state.currentMovieTime
      },
      set (value) {
        this.$store.dispatch('Controller/seekBarAction', {
          value: value
        })
      }
    },
    ...mapState('Player', [
      'videoId',
      'height',
      'width',
      'playerVars'
    ]),
    ...mapState('Controller', [
      'isPlayButtonDisabled',
      'isPauseButtonDisabled'
    ]),
    ...mapState([
      'movieDuration'
    ])
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
