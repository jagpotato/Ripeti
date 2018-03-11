<template>
  <div id="controller">
    <button @click="playButtonAction" :disabled="isPlayButtonDisabled">play</button>
    <button @click="pauseButtonAction" :disabled="isPauseButtonDisabled">pause</button>
    <span class="time">{{currentTimeText}}</span>
    <input id="seekbar" type="range" v-model="currentMovieTime" min="0" :max="movieDuration" :disabled="isSeekbarDisabled">
    <span class="time">{{durationText}}</span>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'controller',
  methods: {
    playButtonAction () {
      this.$store.dispatch('Controller/playButtonAction')
      this.$store.dispatch('Controller/timerAction')
    },
    ...mapActions('Controller', [
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
    ...mapState('Controller', [
      'isSeekbarDisabled'
    ]),
    ...mapState([
      'currentTimeText',
      'movieDuration',
      'durationText',
      'isPlayButtonDisabled',
      'isPauseButtonDisabled'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#controller {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
.time {
  color: white;
}
</style>
