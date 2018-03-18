<template>
  <div id="slider">
    <svg height="40">
      <rect id="baseBar" x="0" y="10" :width="baseBarWidth" height="6" fill="#ffffff"></rect>
      <circle id="thumb" cx="0" cy="13" r="10" fill="#ff0000" draggable="true"></circle>
    </svg>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'slider',
  methods: {
  },
  computed: {
    ...mapState('SeekBar', [
      'baseBarWidth'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#slider {
  display: flex;
  justify-content: center;
  margin-bottom: auto;
}
#slider > svg {
  display: flex;
  justify-content: center;
  width: 80%;
}
</style>
