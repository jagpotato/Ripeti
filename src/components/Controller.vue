<template>
  <div id="controller">
    <button @click="playButtonAction" :disabled="isPlayButtonDisabled">play</button>
    <button @click="pauseButtonAction" :disabled="isPauseButtonDisabled">pause</button>
    <input id="seekbar" type="range" v-model="currentMovieTime" min="0" :max="movieDuration">
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'controller',
  methods: {
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
    ...mapState([
      'movieDuration',
      'isPlayButtonDisabled',
      'isPauseButtonDisabled'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#youtube, #cover, #controller {
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

#controller {
  z-index: 1;
}
</style>
