<template>
  <div id="player">
    <Header></Header>
    <div>
      <youtube id="youtube" :height="height" :width="width" :player-vars="playerVars" ref="youtube" @ready="ready" @playing="playing" @cued="cued" @ended="end"></youtube>
      <div id="cover"></div>
    </div>
    <Controller></Controller>
  </div>
</template>

<script>
import Header from '@/components/Header'
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
    },
    playing () {
      this.$store.dispatch('Player/playingAction')
    },
    cued () {
      this.$store.dispatch('Player/cuedAction')
      this.$store.dispatch('Controller/playButtonAction')
      this.$store.dispatch('Controller/timerAction')
    },
    ...mapActions('Player', {
      end: 'endAction'
    })
  },
  computed: {
    ...mapState('Player', [
      'height',
      'width',
      'playerVars'
    ])
  },
  components: {
    Header,
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
