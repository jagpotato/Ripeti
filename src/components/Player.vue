<template>
  <div id="player">
    <div>
      <youtube id="youtube" :video-id="videoId" :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready" @ended="end"></youtube>
      <div id="cover"></div>
    </div>
    <Controller></Controller>
  </div>
</template>

<script>
import Controller from '@/components/Controller'
import {mapState, mapActions} from 'vuex'

export default {
  name: 'player',
  beforeDestroy () {
    this.$store.dispatch('Player/removeEventAction')
  },
  methods: {
    ready () {
      this.$store.dispatch('Player/readyAction', {
        value: this.$refs.youtube.player
      })
      this.$store.dispatch('Controller/playButtonAction')
      this.$store.dispatch('Controller/timerAction')
    },
    ...mapActions('Player', {
      end: 'endAction'
    })
  },
  computed: {
    ...mapState('Player', [
      'videoId',
      'height',
      'width',
      'playerVars'
    ])
  },
  components: {
    Controller
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#youtube, #cover {
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
</style>
